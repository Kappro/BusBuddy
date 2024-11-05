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
  if current_user:
    return jsonify(current_user.json()), 201
  else:
    return None, 401


@app.route('/api/login', methods=['POST'])
def login():
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
    if current_user.access == AccountAccess.DRIVER:
        deployment_tuple = db.session.execute(text(f"SELECT * FROM busbuddy.deployment_log "+\
                                             f"WHERE ACCOUNT_id='{current_user.uid}' "+\
                                             f"AND (current_status='BUFFER_TIME' "+\
                                             f"OR current_status='ONGOING' "+\
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
    if current_user.access == AccountAccess.MANAGER:
        deployments = [R.json() for R in db.session.execute(db.select(Deployment)).scalars().all()]
        return deployments, 201
    else:
        return 401

@app.route('/api/deployments/get_by_uid', methods=['POST'])
@jwt_required()
def get_deployment_by_uid():
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
    if current_user.access == AccountAccess.MANAGER:
        stops_list = [R for R in db.session.execute(db.select(Stop)).scalars().all()]
        return [R.json() for R in stops_list], 201
    else:
        return 401

@app.route('/api/stops/get_by_service', methods=['POST'])
@jwt_required()
def get_stops_by_service():
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
    if current_user.access == AccountAccess.MANAGER:
        services_list = [R for R in db.session.execute(db.select(Service)).scalars().all()]
        return [R.json() for R in services_list], 201
    else:
        return 401

@app.route('/api/services/add_new', methods=['POST'])
@jwt_required()
def add_service():
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
    if current_user.access == AccountAccess.MANAGER:
        data = request.get_json()
        service = get_service(data.get('service_number'))
        service.delete()
        return jsonify({'message': f'Service Deleted Successfully'}), 201
    else:
        return 401

@app.route('/add_bus', methods=['GET', 'POST'])
def add_bus():
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
    services = [R.service_number for R in db.session.execute(db.select(Service)).scalars().all()]
    return jsonify({'services': services}), 201

@app.route('/forads/deployments/progresses_by_service', methods=['POST'])
def ads_get_all_progress():
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
    service_number = request.get_json()['service_number']
    buses = [R for R in db.session.execute(db.select(Bus)).scalars().all()
             if R.service_number == service_number]
    buses_json = [R.json() for R in buses]
    return jsonify({'buses': buses_json}), 201

@app.route('/forads/drivers/get_available', methods=['GET'])
def ads_get_available_drivers():
    drivers = [R.json() for R in db.session.execute(db.select(Account)).scalars().all()
               if R.driver_status==DriverStatus.ON_BREAK]
    return jsonify({'drivers': drivers}), 201

@app.route('/forads/deployments/deploy', methods=['POST'])
def ads_deploy():
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
