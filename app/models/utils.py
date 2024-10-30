from .accounts.account import Account
from .deployment import Deployment, DeploymentStatus
from .entities.bus import Bus
from .entities.route import Stop, Service
from .shared import db

def last_duty(account: Account):
    duties = [R for R in db.session.execute(db.select(Deployment)).scalars().all()
              if (R.driver_id==account._uid and R.current_status==DeploymentStatus.COMPLETED)]
    if len(duties)==0:
        return None
    return max(duties, key=lambda x: x.datetime_end)

def get_account(account_uid: int or str):
    proper = int(account_uid)
    driver = [R for R in db.session.execute(db.select(Account)).scalars().all()
              if (R.uid==proper)]
    if len(driver)==0:
        return None
    return driver[0]

def get_bus(bus_license_plate: int):
    bus = [R for R in db.session.execute(db.select(Bus)).scalars().all()
              if (R.license_plate==bus_license_plate)]
    if len(bus)==0:
        return None
    return bus[0]

def get_bus_stop(bus_stop_code: int or str):
    proper = int(bus_stop_code)
    stop = [R for R in db.session.execute(db.select(Stop)).scalars().all()
            if (R.stop_code == proper)]
    if len(stop) == 0:
        return None
    return stop[0]

def get_deployment(deployment_uid: int or str):
    proper = int(deployment_uid)
    deployment = [R for R in db.session.execute(db.select(Deployment)).scalars().all()
                  if (R.uid==proper)]
    if len(deployment)==0:
        return None
    return deployment[0]


def get_driver_deployment_history(driver: Account):
    history = [R.json() for R in db.session.execute(db.select(Deployment)).scalars().all()
               if R.driver_id==driver.uid]
    return history

def get_service(service_number: str):
    service = [R for R in db.session.execute(db.select(Service)).scalars().all()
               if R.service_number==service_number]
    if len(service) == 0:
        return None
    return service[0]