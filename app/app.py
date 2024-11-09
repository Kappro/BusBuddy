import logging
from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, current_user, get_jwt, get_jwt_identity, \
    set_access_cookies
from hashlib import sha256
import os
from dotenv import load_dotenv
from sqlalchemy import text
from datetime import datetime, timezone, timedelta

from models.utils import last_duty, get_bus, get_account, get_bus_stop, get_deployment, \
    get_driver_deployment_history, get_service
from models.shared import db
from models.accounts.account import Account, AccountAccess, DriverStatus
from models.entities.bus import Bus, BusStatus
from models.entities.route import Stop, Service
from models.deployment import Deployment, DeploymentStatus
from flasgger import Swagger

import json
import requests

load_dotenv()

# declare constants
HOST = '0.0.0.0'
PORT = 8080
basedir = os.path.abspath(os.path.dirname(__file__))
DATABASE_USER = os.environ.get("DATABASE_USER")
DATABASE_PASSWORD = os.environ.get("DATABASE_PASSWORD")
DATABASE_HOST = os.environ.get("HOST")

# initialize flask application
app = Flask(__name__)
log = logging.getLogger('werkzeug')
swagger = Swagger(app, template={
    "info": {
        "title": "BusBuddy API",
        "description": "API necessary for BusBuddy frontend interaction with database.",
        "version": "1.0.0"
    }
})
# log.setLevel(logging.ERROR)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://'+DATABASE_USER+':'+DATABASE_PASSWORD+'@localhost:'+DATABASE_HOST+'/busbuddy'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_SECRET_KEY'] = 'jwtjwtjwtjwt123123123123'
app.secret_key = 'DEV_KEY'
db.init_app(app)

jwt = JWTManager(app)

@app.route('/')
def index():
    """
    Home page for testing of backend.
    ---
    tags:
        - Backend Testing
    description: Shows possible options for backend interaction.
    """
    return render_template('home.html')

@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.uid

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    acc_list = [R for R in db.session.execute(db.select(Account)).scalars().all()
                if R.uid==identity]
    if len(acc_list)==0:
        return None
    else:
        return acc_list[0]

@app.route('/api/get_identity', methods=['GET'])
@jwt_required()
def get_identity():
    """
    This uses the provided JSON Web Token (JWT) in the headers to retrieve information about the user.
    ---
    tags:
        - User
    description: Returns the queried user, or None.
    responses:
        201:
            description: A successful retrieval of identity. Contains "uid", "name", "password_hashed", "email", "type"
                         (Manager or Driver), "datetime_registered", "driver_status" (None if user is Manager).
        401:
            description: Failure to retrieve identity. Usually user not found.
    """
    if current_user:
        return jsonify(current_user.json()), 201
    else:
        return None, 401


@app.route('/api/login', methods=['POST'])
def login():
    """
    This uses email and password to verify if user exists in database. Generates a JSON Web Token (JWT) if successful.
    "email" and "password" are required. "password" should be in unhashed form.
    ---
    parameters:
        - name: email
          type: string
          required: true
          
        - name: password
          type: string
          required: true
          
    tags:
        - User
    description: Logs in using credentials.
    responses:
        201:
            description: A successful login response. Gives the access token under "access_token".
        401:
            description: A failed login response.
    """
    data = request.get_json()
    email = data['email']
    password_hashed = sha256(data['password'].encode('utf-8')).hexdigest()
    account_list = [R for R in db.session.execute(db.select(Account)).scalars().all()
                    if R.email==email and R.password_hashed==password_hashed]
    if len(account_list)==0:
        return jsonify({'message': 'Login Unsuccessful'}), 401
    else:
        access_token = create_access_token(identity=account_list[0], expires_delta=timedelta(days=2))
        return jsonify({'message': 'Login Successful', 'access_token': access_token})

@app.route('/api/signup', methods=['POST'])
def signup():
    """
    This creates a new user to be stored in database. "name", "password", "email", "contact", "access" are required.
    Access should only be either "MANAGER" or "DRIVER".
    ---
    parameters:
        - name: name
          type: string
          required: true
          
        - name: email
          type: string
          required: true
          
        - name: password
          type: string
          required: true
          
        - name: contact
          type: int
          required: true
          
        - name: access
          type: string
          enum: ['MANAGER', 'DRIVER']
          required: true
          
    tags:
        - User
    description: Uses information to generate new user based on database model.
    responses:
        201:
            description: A successful response. Returns the created user's details back, containing "uid", "name",
                         "password_hashed", "email", "type", "datetime_registered", "driver_status".
    """
    data = request.get_json()
    name = data.get('name')
    password = data.get('password')
    email = data.get('email')
    contact = data.get('contact')
    access = AccountAccess[data.get('type')]
    new_account = Account(name, password, email, contact, access, driver_status=DriverStatus.ON_BREAK)
    return new_account.json(), 201

@app.route('/api/drivers/get_all', methods=['GET'])
@jwt_required()
def get_all_drivers():
    """
    This retrieves all the drivers that are in the database.
    ---
    description: Returns array of all drivers in database
    tags:
        - Drivers
    responses:
        201:
            description: A successful response. returns array of all drivers. Each driver is given with "uid", "name",
                         "current_state", "date_registered", "last_duty", "email". "contact".
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        drivers_list = [R for R in db.session.execute(db.select(Account)).scalars().all()
                        if (R.access == AccountAccess.DRIVER and R.uid > 0)]
        return [{'uid': R.uid,
                 'name': R.name,
                 'current_state': R.driver_status.value,
                 'date_registered': R.datetime_registered,
                 'last_duty': last_duty(R),
                 'avatar': "",
                 'color': "",
                 'email': R.email,
                 'contact': R.contact} for R in drivers_list], 201
    else:
        return 401

@app.route('/api/drivers/get_by_uid', methods=['POST'])
@jwt_required()
def get_driver_by_uid():
    """
    This retrieves a single driver's information based on the UID given. "driver_uid" is required in the request.
    ---
    parameters:
        - name: driver_uid
          type: string or int
          required: true
          
    tags:
        - Drivers
    description: Returns a single driver's information if UID is found.
    responses:
        201:
            description: A successful response. User is either found, or returned as None if not found. If found, user
                         is given with "uid", "name", "current_state", "date_registered", "last_duty", "email". "contact".
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        uid = data.get('driver_uid')
        driver = get_account(uid)
        if driver:
            return {'uid': driver.uid,
                    'name': driver.name,
                    'current_state': driver.driver_status.value,
                    'datetime_registered': driver.datetime_registered,
                    'last_duty': last_duty(driver),
                    'avatar': "",
                    'color': "",
                    'email': driver.email,
                    'contact': driver.contact}, 201
    return 401

@app.route('/api/drivers/get_history_by_uid', methods=['POST'])
@jwt_required()
def get_driver_history_by_uid():
    """
    This retrieves a single driver's deployment history based on the UID given. "driver_uid" is required if requesting
    user is a manager, and will provide all deployment including ongoing ones, but not if driver is requesting as the
    endpoint will only return the particular driver's history. If driver is requesting, only completed or cancelled
    deployments are given, excluding the ongoing ones.
    ---
    parameters:
        - name: driver_uid
          type: string or int
          required: true
    tags:
        - Drivers
    description: Returns a single driver's deployment history if UID is found.
    responses:
        201:
            description: A successful response. User is either found, or returned as None if not found. If user is found,
                         each deployment is given with "driver_id", "bus_license_plate", "datetime_start", "datetime_end",
                         "current_status", "uid", "service_number", "driver_name", "current_stop".
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    data = request.get_json()
    uid = data.get('driver_uid')
    driver = get_account(uid)
    if driver:
        if current_user.access == AccountAccess.DRIVER:
            return [R for R in get_driver_deployment_history(driver)
                    if (R['current_status']=="Completed" or R['current_status']=="Cancelled")], 201
        return get_driver_deployment_history(driver), 201
    else:
        return {}, 201

@app.route('/api/drivers/get_current_deployment', methods=['GET'])
@jwt_required()
def get_current_deployment():
    """
    This gets the newest ongoing deployment assigned to the driver.
    ---
    tags:
        - Drivers
    description: Returns the deployment details and assigned route if there is a new deployment for the driver, or a
                 "-1" UID deployment with no details or route if there are no new deployments.
    responses:
        201:
            description: A successful response. Corresponding deployment details tagged under "deployment" and "route".
                         Under "deployment", if found, deployment is given with details "driver_id", "bus_license_plate",
                         "datetime_start", "datetime_end", "current_status", "uid", "service_number", "driver_name",
                         "current_stop". If not found, deployment is given with only "uid", set at -1.
        401:
            description: Unauthorised access. User is either not logged in or not a DRIVER.
    """
    if current_user.access == AccountAccess.DRIVER:
        deployment_tuple = db.session.execute(text(f"SELECT * FROM busbuddy.deployment_log "+ \
                                                   f"WHERE ACCOUNT_id='{current_user.uid}' "+ \
                                                   f"AND (current_status='BUFFER_TIME' "+ \
                                                   f"OR current_status='ONGOING' "+ \
                                                   f"OR current_status='RETURNING')")).one_or_none()
        if deployment_tuple:
            deployment = db.get_or_404(Deployment, (deployment_tuple[0], deployment_tuple[1], deployment_tuple[2]))
            stops = [R.json() for R in get_service(deployment.service_number).stops]
            return jsonify({'deployment': deployment.json(), 'route': stops}), 201
        else:
            return jsonify({'deployment': {'uid': -1}}), 201
    return 401

@app.route('/api/deployments/early_approve', methods=['POST'])
@jwt_required()
def early_approve():
    """
    This allows manager to early approve the deployment before the automatic deployment acceptance. "deployment_uid" is required in the request.
    ---
    parameters:
        - name: deployment_uid
          type: string or int
          required: true
    tags:
        - Deployments
    description: Returns the success of the early approval.
    responses:
        201:
            description: A success response.
        500:
            description: Internal Server Error. Usually because deployment UID not found.
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        uid = data.get('deployment_uid')
        deployment = get_deployment(uid)
        if deployment.early_approve():
            return jsonify({'message': "Successfully Approved"}), 201
        else:
            return jsonify({'message': "Approval Failed"}), 500
    return 401

@app.route('/api/deployments/start_drive', methods=['POST'])
@jwt_required()
def start_drive():
    """
    This allows driver to start their current deployment if it is on Buffer Time. "deployment_uid" is required in the request.
    ---
    parameters:
        - name: deployment_uid
          type: string or int
          required: true
          
    tags:
        - Deployments
    description: Returns the success of the drive start.
    responses:
        201:
            description: A success response.
        500:
            description: Internal Server Error. Usually because deployment UID not found.
        401:
            description: Unauthorised access. User is either not logged in or not a DRIVER.
    """
    if current_user.access == AccountAccess.DRIVER:
        data = request.get_json()
        uid = data.get('deployment_uid')
        deployment = get_deployment(uid)
        if deployment.start_drive():
            return jsonify({'message': "Successfully Started"}), 201
        else:
            return jsonify({'message': "Failed to Start"}), 500
    return 401

@app.route('/api/deployments/reach_next_stop', methods=['POST'])
@jwt_required()
def reach_next_stop():
    """
    This allows driver to indicate their progress to the next stop in their stipulated route. "deployment_uid" is required in the request.
    ---
    parameters:
        - name: deployment_uid
          type: string or int
          required: true
    tags:
        - Deployments
    description: Returns the success of the next stop.
    responses:
        201:
            description: A success response.
        500:
            description: Internal Server Error. Usually because deployment UID not found.
        401:
            description: Unauthorised access. User is either not logged in or not a DRIVER.
    """
    if current_user.access == AccountAccess.DRIVER:
        data = request.get_json()
        uid = data.get('deployment_uid')
        deployment = get_deployment(uid)
        if deployment.complete_stop():
            return jsonify({'message': "Successfully At Next Stop"}), 201
        else:
            return jsonify({'message': "Failed to Go Next Stop"}), 500
    return 401

@app.route('/api/deployments/complete_deployment', methods=['POST'])
@jwt_required()
def complete_deployment():
    """
    This allows driver to complete their current deployment. "deployment_uid" is required in the request.
    ---
    parameters:
        - name: deployment_uid
          type: string or int
          required: true
    tags:
        - Deployments
    description: Returns the success of the completion.
    responses:
        201:
            description: A success response.
        500:
            description: Internal Server Error. Usually because deployment UID not found.
        401:
            description: Unauthorised access. User is either not logged in or not a DRIVER.
    """
    if current_user.access == AccountAccess.DRIVER:
        data = request.get_json()
        uid = data.get('deployment_uid')
        deployment = get_deployment(uid)
        if deployment.complete():
            return jsonify({'message': "Successfully Completed"}), 201
        else:
            return jsonify({'message': "Failed to Complete"}), 500
    return 401

@app.route('/api/deployments/return_bus', methods=['POST'])
@jwt_required()
def return_bus():
    """
    This allows driver to indicate that they have parked the bus and fully completed the deployment. "deployment_uid" is required in the request.
    ---
    parameters:
        - name: deployment_uid
          type: string or int
          required: true
    tags:
        - Deployments
    description: Returns the success of the bus return.
    responses:
        201:
            description: A success response.
        500:
            description: Internal Server Error. Usually because deployment UID not found.
        401:
            description: Unauthorised access. User is either not logged in or not a DRIVER.
    """
    if current_user.access == AccountAccess.DRIVER:
        data = request.get_json()
        uid = data.get('deployment_uid')
        deployment = get_deployment(uid)
        if deployment.return_bus():
            return jsonify({'message': 'Bus Returned to Depot'}), 201
        else:
            return jsonify({'message': 'Bus Return Failed'}), 500
    else:
        return 401

@app.route('/api/deployments/cancel', methods=['POST'])
@jwt_required()
def cancel():
    """
    This allows manager to cancel a deployment before accepting, or during buffer time. "deployment_uid" is required in the request.
    ---
    parameters:
        - name: deployment_uid
          type: string or int
          required: true
    tags:
        - Deployments
    description: Returns the success of the cancellation.
    responses:
        201:
            description: A success response.
        500:
            description: Internal Server Error. Usually because deployment UID not found.
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        uid = data.get('deployment_uid')
        deployment = get_deployment(uid)
        if deployment.cancel():
            return jsonify({'message': 'Cancellation Success'}), 201
        else:
            return jsonify({'message': 'Cancellation Failed'}), 500
    return 401

@app.route('/api/deployments/change_driver', methods=['POST'])
@jwt_required()
def change_driver():
    """
    This allows managers to change the driver of a deployment. "deployment_uid", "driver_id" is required in the request.
    ---
    parameters:
        - name: deployment_uid
          type: string or int
          required: true
        - name: driver_id
          type: string or int
          required: true
          description: UID of new driver to change to.
    tags:
        - Deployments
    description: Returns the success of the change.
    responses:
        201:
            description: A success response.
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        uid = data.get('deployment_uid')
        driver = data.get('driver_uid')
        deployment = get_deployment(uid)
        bus_plate = deployment.bus_license_plate
        deployment.cancel()
        Deployment(driver, bus_plate)
        return jsonify({'message': f'Change Driver Success, New Deployment Created'}), 201
    return 401

@app.route('/api/deployments/check_new', methods=['GET'])
@jwt_required()
def check_new_requests():
    """
    This allows managers to check if there are any newly created deployments required for their approval.
    ---
    tags:
        - Deployments
    description: Returns whether there are new deployments required for their approval.
    responses:
        201:
            description: A success response. True if there are new requests, or False if there are none.
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        deployments = db.session.execute(text(f"SELECT * FROM busbuddy.deployment_log WHERE current_status='PREDEPLOYMENT'")).all()
        if len(deployments) > 0:
            return jsonify({'message': True}), 201
        else:
            return jsonify({'message': False}), 201
    else:
        return 401

@app.route('/api/deployments/get_new', methods=['GET'])
@jwt_required()
def get_new_requests():
    """
    This allows managers to get the information of the deployments required for their approval.
    ---
    tags:
        - Deployments
    description: Returns whether there are new deployments required for their approval.
    responses:
        201:
            description: A success response. Returns an array of all deployments required for approval. Each deployment
                         will be given with "deployment_uid", "service_number", "driver_uid", "driver_name", "bus_license_plate",
                         "datetime_start" and "current_status".
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        deployments = [R for R in db.session.execute(db.select(Deployment)).scalars().all()
                       if R.current_status==DeploymentStatus.PREDEPLOYMENT.value]
        return [{
            'deployment_uid': R.uid,
            'service_number': get_bus(R.bus_license_plate).service_number,
            'driver_uid': R.driver_id,
            'driver_name': get_account(R.driver_id).name,
            'bus_license_plate': R.bus_license_plate,
            'datetime_start': R.datetime_start,
            'current_status': R.current_status
        } for R in deployments], 201
    else:
        return 401

@app.route('/api/deployments/get_all', methods=['GET'])
@jwt_required()
def get_all_deployments():
    """
    This allows managers to check all deployments history.
    ---
    tags:
        - Deployments
    description: Returns a whole array of deployments.
    responses:
        201:
            description: A success response. Each deployment will be given with "driver_id", "bus_license_plate",
                         "datetime_start", "datetime_end", "current_status", "uid", "service_number", "driver_name", "current_stop".
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        deployments = [R.json() for R in db.session.execute(db.select(Deployment)).scalars().all()]
        return deployments, 201
    else:
        return 401

@app.route('/api/deployments/get_by_uid', methods=['POST'])
@jwt_required()
def get_deployment_by_uid():
    """
    This allows managers to get the details of one specific deployment. "deployment_uid" is required in the request.
    ---
    parameters:
        - name: deployment_uid
          type: string or int
          required: true
    tags:
        - Deployments
    description: Returns one deployment details.
    responses:
        201:
            description: A success response. The deployment will be given with "deployment_uid", "service_number",
                         "driver_uid", "driver_name", "bus_license_plate", "datetime_start", "current_status".
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        uid = data.get('deployment_uid')
        deployment = get_deployment(uid)
        if deployment:
            return {
                'deployment_uid': deployment.uid,
                'service_number': get_bus(deployment.bus_license_plate).service_number,
                'driver_uid': deployment.driver_id,
                'driver_name': get_account(deployment.driver_id).name,
                'bus_license_plate': deployment.bus_license_plate,
                'datetime_start': deployment.datetime_start,
                'current_status': deployment.current_status
            }, 201
    return 401

@app.route('/api/stops/get_all', methods=['GET'])
@jwt_required()
def get_all_stops():
    """
    This allows managers to get the details of all available bus stops.
    ---
    tags:
        - Stops
    description: Returns all bus stop details.
    responses:
        201:
            description: A success response. Each bus stop is given with "stop_code", "stop_name", "latitude", "longitude",
                         "current_load".
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        stops_list = [R for R in db.session.execute(db.select(Stop)).scalars().all()]
        return [R.json() for R in stops_list], 201
    else:
        return 401

@app.route('/api/stops/get_by_service', methods=['POST'])
@jwt_required()
def get_stops_by_service():
    """
    This allows managers to get the details of all bus stops that cater to the service queried about. "service_number"
    is required in the request.
    ---
    parameters:
        - name: service_number
          type: string
          required: true
    tags:
        - Stops
    description: Returns bus stop details in the service provided.
    responses:
        201:
            description: A success response. Each bus stop is given with "stop_code", "stop_name", "latitude", "longitude",
                         "current_load".
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        service_number = data.get('service_number')
        service = get_service(service_number)
        return [R.json() for R in service.stops], 201
    else:
        return 401

@app.route('/api/stops/create', methods=['POST'])
@jwt_required()
def create_stop():
    """
    This allows managers to create a new bus stop entry. "stop_code", "stop_name", "latitude", "longitude" are required.
    ---
    parameters:
        - name: stop_code
          type: string or int
          required: true
        - name: stop_name
          type: string
          required: true
        - name: latitude
          type: float
          required: true
        - name: longitude
          type: float
          required: true
    tags:
        - Stops
    description: Returns success of the bus stop creation.
    responses:
        201:
            description: A success response.
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        stop_code = data.get('stop_code')
        stop_name = data.get('stop_name')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        Stop(stop_code, stop_name, latitude, longitude)
        return jsonify({'message': f'Stop {stop_code} Created Successfully'}), 201
    else:
        return 401

@app.route('/api/stops/get_stop_details', methods=['POST'])
@jwt_required()
def get_stop_details():
    """
    This allows managers to get the details of a particular bus stop. "stop_code" is required in request.
    ---
    parameters:
        - name: stop_code
          type: string
          required: true
    tags:
        - Stops
    description: Returns all bus stop details.
    responses:
        201:
            description: A success response. Each bus stop is given with "stop_code", "stop_name", "latitude", "longitude",
                         "current_load".
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        stop_code = data.get('stop_code')
        stop = get_bus_stop(stop_code)
        service_list = db.session.execute(text(f"SELECT * FROM busbuddy.service_bus_stops WHERE bus_stop_code='{stop_code}'")).all()
        message = {
            'stop_code': stop.stop_code,
            'stop_name': stop.stop_name,
            'latitude': stop.latitude,
            'longitude': stop.longitude,
            'services': [R.json() for R in service_list]
        }
        return jsonify(message), 201
    else:
        return 401

@app.route('/api/stops/delete', methods=['POST'])
@jwt_required()
def delete_stop():
    """
    This allows managers to delete the records of a particular bus stop. "stop_code" is required in request.
    ---
    parameters:
        - name: stop_code
          type: string
          required: true
    tags:
        - Stops
    description: Returns success of deletion.
    responses:
        201:
            description: A success response.
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        stop_code = data.get('stop_code')
        stop = get_bus_stop(stop_code)
        stop.delete()
        return jsonify({'message': f'Stop {stop_code} Deleted Successfully'}), 201
    else:
        return 401

@app.route('/api/services/get_all', methods=['GET'])
@jwt_required()
def get_all_services():
    """
    This allows managers to get the details of a particular service. "service_number" is required in request.
    ---
    parameters:
        - name: service_number
          type: string
          required: true
    tags:
        - Services
    description: Returns all services details.
    responses:
        201:
            description: A success response. Each service is given with "service_number", "number_of_stops", "start_stop_name" (name of first stop).
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        services_list = [R for R in db.session.execute(db.select(Service)).scalars().all()]
        return [R.json() for R in services_list], 201
    else:
        return 401

@app.route('/api/services/add_new', methods=['POST'])
@jwt_required()
def add_service():
    """
    This allows managers to add a new service. "service" (service number), "stops" (list of stop codes)" required in the request.
    ---
    parameters:
        - name: service_number
          type: string
          required: true
        - name: stops
          type: list[int]
          required: true
          description: List of stop codes in order of sequence.
    tags:
        - Services
    description: Returns success of creation.
    responses:
        201:
            description: A success response.
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        service = Service(data.get('service'))
        stops = data.get('stops')
        stops = [stop.strip() for stop in stops]
        if len(stops)>0:
            for i in range(len(stops)):
                service.add_stop(stops[i], i+1)
        return jsonify({'message': f'Service Added Successfully'}), 201
    else:
        return 401

@app.route('/api/services/edit', methods=['POST'])
@jwt_required()
def edit_service():
    """
    This allows managers to modify the route of a particular service. "service_number", "new_stops" (list of stop codes
    as strings) are required in request.
    ---
    parameters:
        - name: service_number
          type: string
          required: true
        - name: new_stops
          type: list[int]
          required: true
          description: List of new bus stop codes in order of sequence.
    tags:
        - Services
    description: Returns success of modification.
    responses:
        201:
            description: A success response.
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        service = get_service(data.get('service'))
        new_stops = data.get('new_stops')
        service.clear_stops()
        for i in range(len(new_stops)):
            service.add_stop(new_stops[i], i+1)
        return jsonify({'message': f'Service Edited Successfully'}), 201
    else:
        return 401

@app.route('/api/services/delete', methods=['POST'])
@jwt_required()
def delete_service():
    """
    This allows managers to delete of a particular service. "service_number" is required in request.
    ---
    parameters:
        - name: service_number
          type: string
          required: true
    tags:
        - Services
    description: Returns success of deletion.
    responses:
        201:
            description: A success response.
        401:
            description: Unauthorised access. User is either not logged in or not a MANAGER.
    """
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        service = get_service(data.get('service_number'))
        service.delete()
        return jsonify({'message': f'Service Deleted Successfully'}), 201
    else:
        return 401

@app.route('/add_bus', methods=['GET', 'POST'])
def add_bus():
    """
    This is backend developer page for adding new buses.
    ---
    tags:
        - Backend Testing
    description: Returns template.
    """
    if request.method == 'POST':
        data = request.form
        license_plate = data.get('license_plate')
        capacity = int(data.get('capacity'))
        service_number = data.get('service_number')
        if service_number == '-1':
            service_number = None
        Bus(license_plate, capacity, service_number)
    available_services = db.session.execute(db.select(Service)).scalars().all()
    return render_template('add_bus.html', available_services=available_services)

@app.route('/deploy', methods=['GET', 'POST'])
def deploy():
    """
    This is backend developer page for creating new deployments.
    ---
    tags:
        - Backend Testing
    description: Returns template.
    """
    if request.method == 'POST':
        data = request.form
        driver = [R for R in db.session.execute(db.select(Account)).scalars().all()
                  if R.uid==int(data.get('driver'))][0].uid
        bus = [R for R in db.session.execute(db.select(Bus)).scalars().all()
               if R.license_plate==data.get('bus')][0].license_plate
        Deployment(driver, bus)
    available_buses = [R for R in db.session.execute(db.select(Bus)).scalars().all()
                       if R.current_status==BusStatus.IN_DEPOT]
    drivers_list = db.session.execute(db.select(Account)).scalars().all()
    available_drivers = [R for R in [S for S in drivers_list
                                     if S.access==AccountAccess.DRIVER]
                         if R.driver_status==DriverStatus.ON_BREAK]
    return render_template('deployment.html', available_drivers=available_drivers, available_buses=available_buses)

@app.route('/add_stop', methods=['GET', 'POST'])
def add_stop():
    """
    This is backend developer page for adding new bus stops.
    ---
    tags:
        - Backend Testing
    description: Returns template.
    """
    if request.method == 'POST':
        data = request.form
        stop_code = data.get('code')
        name = data.get('name')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        Stop(stop_code, name, latitude, longitude)
    return render_template('add_stop.html')

@app.route('/choose_deployment', methods=['GET', 'POST'])
def choose_deployment():
    """
    This is backend developer page for filtering deployments based on driver and bus.
    ---
    tags:
        - Backend Testing
    description: Returns template.
    """
    if request.method == 'POST':
        data = request.form
        driver_item = [R for R in db.session.execute(db.select(Account)).scalars().all()
                       if R.uid == int(data.get('driver'))][0]
        driver = driver_item.uid
        driver_name = driver_item.name
        bus = [R for R in db.session.execute(db.select(Bus)).scalars().all()
               if R.license_plate == data.get('bus')][0].license_plate
        available_deployments = [R.uid for R in db.session.execute(db.select(Deployment)).scalars().all()
                                 if (R.driver_id == int(driver) and R.bus_license_plate == bus)]
        session['found_deployments'] = available_deployments
        session['driver_name'] = driver_name
        session['driver'] = driver
        session['bus'] = bus
        return redirect(url_for('choose_deployment2'))
    available_buses = [R for R in db.session.execute(db.select(Bus)).scalars().all()]
    available_drivers = [R for R in db.session.execute(db.select(Account)).scalars().all()
                         if R.access == AccountAccess.DRIVER]
    return render_template('choose_deployment.html', available_drivers=available_drivers, available_buses=available_buses)

@app.route('/choose_deployment2', methods=['GET', 'POST'])
def choose_deployment2():
    """
    This is backend developer page for choosing the deployment after filtering.
    ---
    tags:
        - Backend Testing
    description: Returns template.
    """
    if request.method == 'POST':
        data = request.form
        session['deployment_id'] = data.get('deployment_id')
        return redirect(url_for('change_deployment'))
    found_deployment_ids = session.pop('found_deployments', default=[])
    found_deployments = [R for R in db.session.execute(db.select(Deployment)).scalars().all()
                         if R.uid in found_deployment_ids]
    bus = session['bus']
    driver_name = session['driver_name']
    return render_template('choose_deployment2.html',
                           found_deployments=found_deployments,
                           bus=bus,
                           driver_name=driver_name)

@app.route('/change_deployment', methods=['GET', 'POST'])
def change_deployment():
    """
    This is backend developer page for changing the status of a deployment.
    ---
    tags:
        - Backend Testing
    description: Returns template.
    """
    if request.method == 'POST':
        data = request.form
        deployment_id = session['deployment_id']
        deployment = [R for R in db.session.execute(db.select(Deployment)).scalars().all()
                      if R.uid == int(deployment_id)][0]
        deployment.new_status(deployment.available_statuses[int(data.get('action'))])
        return redirect(url_for('choose_deployment'))
    deployment_id = session['deployment_id']
    deployment = [R for R in db.session.execute(db.select(Deployment)).scalars().all()
                  if R.uid == int(deployment_id)][0]
    bus = session.pop('bus', default=None)
    driver_name = session.pop('driver_name', default=None)
    return render_template('change_deployment.html',
                           deployment=deployment,
                           bus=bus,
                           driver_name=driver_name)

@app.route('/add_service_to_stop', methods=['GET', 'POST'])
def add_service_to_stop():
    """
    This is backend developer page for creating bus stop to bus service connections.
    ---
    tags:
        - Backend Testing
    description: Returns template.
    """
    if request.method == 'POST':
        data = request.form
        service_number = data.get('service_number')
        stop_code = data.get('stop_code')
        stop = [R for R in db.session.execute(db.select(Stop)).scalars().all()
                if R.stop_code == int(stop_code)][0]
        stop.add_service(service_number)
    available_services = [R for R in db.session.execute(db.select(Service)).scalars().all()]
    available_stops = [R for R in db.session.execute(db.select(Stop)).scalars().all()]
    return render_template('add_service_to_stop.html', available_services=available_services, available_stops=available_stops)

@app.route('/forads/services/get', methods=['GET'])
def ads_get_services():
    """
    This is a dedicated function that is used by the automated deployment system. This gives a list of services that
    are available.
    ---
    tags:
        - Automated Deployment System Utilities
    description: Returns service numbers available in database.
    responses:
        201:
            description: A success response. Each service is given as a singular service number.
    """
    services = [R.service_number for R in db.session.execute(db.select(Service)).scalars().all()]
    return jsonify({'services': services}), 201

@app.route('/forads/deployments/progresses_by_service', methods=['POST'])
def ads_get_all_progress():
    """
    This is a dedicated function that is used by the automated deployment system. This gives a list of the current stop
    of all deployments under the service. "service_number" is required in the request.
    ---
    tags:
        - Automated Deployment System Utilities
    description: Returns current stops of all deployments by the service.
    responses:
        201:
            description: A success response. Each current stop is given as a singular sequence number.
    """
    deployments = [R for R in db.session.execute(db.select(Deployment)).scalars().all()
                   if (R.current_status==DeploymentStatus.ONGOING.value or R.current_status==DeploymentStatus.RETURNING.value)]
    data = request.get_json()
    service_number = data['service_number']
    service_deployments = [R for R in deployments if R.service_number==service_number]
    if len(service_deployments)==0:
        return jsonify({'stops_left': []}), 201
    progresses = [int(R.current_stop) for R in service_deployments]
    return jsonify({'progresses': progresses}), 201

@app.route('/forads/deployments/stops_left_by_service', methods=['POST'])
def ads_get_all_stops_left():
    """
    This is a dedicated function that is used by the automated deployment system. This gives a list of the remaining stops
    of all deployments under the service. "service_number" is required in the request.
    ---
    tags:
        - Automated Deployment System Utilities
    description: Returns remaining stops of all deployments by the service.
    responses:
        201:
            description: A success response. Each remaining stops is given as a singular sequence number.
    """
    deployments = [R for R in db.session.execute(db.select(Deployment)).scalars().all()
                   if (R.current_status==DeploymentStatus.ONGOING.value or
                       R.current_status==DeploymentStatus.PREDEPLOYMENT.value or
                       R.current_status==DeploymentStatus.BUFFER_TIME.value)]
    data = request.get_json()
    service_number = data['service_number']
    service_deployments = [R for R in deployments if R.service_number==service_number]
    if len(service_deployments)==0:
        return jsonify({'stops_left': []}), 201
    service = [R for R in db.session.execute(db.select(Service)).scalars().all()
               if R.service_number==service_number][0]
    total_stops = len(service.stops)
    stops_left = []
    for R in service_deployments:
        if int(R.current_stop) == -1:
            stops_left.append(total_stops)
        else:
            stops_left.append(total_stops - int(R.current_stop))
    return jsonify({'stops_left': stops_left}), 201

@app.route('/forads/services/get_high_loads', methods=['POST'])
def ads_get_high_loads():
    """
    This is a dedicated function that is used by the automated deployment system. This gives a list of the bus stops under
    the given service number, which have either medium or high loads. "service_number" is required in the request.
    ---
    tags:
        - Automated Deployment System Utilities
    description: Returns stops with medium or high loads by the service.
    responses:
        201:
            description: A success response. Each stop is given with its "sequence_number" and "load" (as a value of either
                         2 for medium or 3 for high).
    """
    service_number = request.get_json()['service_number']
    service = [R for R in db.session.execute(db.select(Service)).scalars().all()
               if R.service_number == service_number][0]
    high_loads = []
    stops = service.stops
    for i in range(len(stops)):
        if stops[i].current_load.value != 1:
            stops.append({
                'sequence_number': i+1,
                'load': stops[i].current_load.value
            })
            stops.append(i+1)
    return jsonify({'stops': high_loads}), 201

@app.route('/forads/buses/get_by_service', methods=['POST'])
def ads_get_service_buses():
    """
    This is a dedicated function that is used by the automated deployment system. This gives a list of the available buses
    under the service. "service_number" is required in the request.
    ---
    tags:
        - Automated Deployment System Utilities
    description: Returns all buses under the service.
    responses:
        201:
            description: A success response. Each bus is given with "service_number", "capacity", "current_load", "current_status",
                         "license_plate".
    """
    service_number = request.get_json()['service_number']
    buses = [R for R in db.session.execute(db.select(Bus)).scalars().all()
             if R.service_number == service_number]
    buses_json = [R.json() for R in buses]
    return jsonify({'buses': buses_json}), 201

@app.route('/forads/drivers/get_available', methods=['GET'])
def ads_get_available_drivers():
    """
    This is a dedicated function that is used by the automated deployment system. This gives a list of the current
    available drivers, i.e. with status On Break.
    ---
    tags:
        - Automated Deployment System Utilities
    description: Returns all drivers on break.
    responses:
        201:
            description: A success response. Each driver is given with "uid", "name", "password_hashed", "email", "type",
                         "datetime_registered", "driver_status".
    """
    drivers = [R.json() for R in db.session.execute(db.select(Account)).scalars().all()
               if R.driver_status==DriverStatus.ON_BREAK]
    return jsonify({'drivers': drivers}), 201

@app.route('/forads/deployments/deploy', methods=['POST'])
def ads_deploy():
    """
    This is a dedicated function that is used by the automated deployment system. This allows the ADS to create a new
    deployment. "driver_uid", "bus_license_plate" are required in the request.
    ---
    tags:
        - Automated Deployment System Utilities
    description: Returns success of deployment.
    responses:
        201:
            description: A success response.
    """
    data = request.get_json()
    driver_uid = data['driver_uid']
    bus_license_plate = data['bus_license_plate']
    Deployment(driver_uid, bus_license_plate)
    return jsonify({'message': "Deployment Successful"}), 201

# @app.route('/priv1', methods=['GET'])
# def __private_func():
#     with open("D:/NTU Projects/SC2006/busbuddy/199route", "r") as f:
#         thing = json.load(f)
#
#     routes = [{"stop_code": R['BusStopCode'], "sequence_number": R['StopSequence']} for R in thing['value'] if
#               R['ServiceNo'] == '199']
#     print(routes)
#
#     urlbase = "https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip="
#
#     payload = {}
#     headers = {
#         'AccountKey': 'WhxR8Z/nSgu+Yj804DZVpA== '
#     }
#
#     for n in routes:
#         result = []
#         x = 0
#         while len(result) == 0:
#             response = requests.request("GET", urlbase + str(x), headers=headers, data=payload)
#             result = [R for R in response.json()['value'] if R['BusStopCode'] == n['stop_code']]
#             if len(result) == 0:
#                 x += 500
#             else:
#                 if db.session.execute(text(f"SELECT * FROM busbuddy.bus_stop WHERE stop_code='{result[0]['BusStopCode']}'")).one_or_none():
#                     break
#                 Stop(result[0]['BusStopCode'], result[0]['Description'], result[0]['Latitude'], result[0]['Longitude'])
#                 break
#     return 201
#
# @app.route('/priv2', methods=['GET'])
# def __private_func2():
#     with open("D:/NTU Projects/SC2006/busbuddy/199route", "r") as f:
#         thing = json.load(f)
#
#     for n in [R for R in thing['value'] if R['ServiceNo'] == '199']:
#         print(n['BusStopCode'])
#         stop = get_bus_stop(n['BusStopCode'])
#         stop.add_service('199', n['StopSequence'])

if __name__ == '__main__':
    # run web server
    app.run(host=HOST, port=PORT)
