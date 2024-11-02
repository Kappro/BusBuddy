from sqlalchemy import text

from .shared import db
from datetime import datetime, timedelta
from enum import Enum
from .accounts.account import Account, DriverStatus
from .entities.bus import Bus, BusStatus

class DeploymentStatus(Enum):
    PREDEPLOYMENT = "Predeployment"
    BUFFER_TIME = "Buffer Time"
    ONGOING = "Ongoing"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class InvalidStatusChangeException(Exception):
    pass

class DeploymentStatusLogEntry(db.Model):
    __tablename__ = 'deployment_status_log'

    _deployment_uid = db.Column('DEPLOYMENT_LOG_uid', db.Integer, nullable=False, autoincrement=True)
    _new_status = db.Column('new_status', db.Enum(DeploymentStatus), nullable=False)
    _datetime_changed = db.Column('datetime_changed', db.DateTime, nullable=False)

    __table_args__ = (db.ForeignKeyConstraint([_deployment_uid],
                                              ['deployment_log.uid']),
                      db.PrimaryKeyConstraint(_deployment_uid,
                                               _datetime_changed))


    def __init__(self, deployment_uid, new_status):
        self._deployment_uid = deployment_uid
        self._new_status = new_status
        self._datetime_changed = datetime.now()
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return f'<Deployment {self._deployment_uid}, changed to {self.new_bus_status} at {self.datetime_changed}>'

    @property
    def deployment_uid(self):
        return self._deployment_uid

    @property
    def new_bus_status(self):
        return self._new_status

    @property
    def datetime_changed(self):
        return self._datetime_changed

    def json(self):
        return {
            'uid': self._deployment_uid,
            'new_status': self._new_status,
            'datetime_changed': self._datetime_changed
        }


class Deployment(db.Model):
    __tablename__ = 'deployment_log'

    _driver_id = db.Column('ACCOUNT_id', db.Integer, db.ForeignKey('bus.license_plate'))
    _bus_license_plate = db.Column('BUS_license_plate', db.String(10), db.ForeignKey('bus.license_plate'))
    _datetime_start = db.Column('datetime_start', db.DateTime)
    _datetime_end = db.Column('datetime_end', db.DateTime, nullable=True)
    _current_status = db.Column('current_status', db.Enum(DeploymentStatus), nullable=False)
    status_log = db.relationship('DeploymentStatusLogEntry', backref='deployment_log', lazy='dynamic')
    _uid = db.Column('uid', db.Integer, unique=True, nullable=False, autoincrement=True)

    __table_args__ = (db.PrimaryKeyConstraint(_driver_id,
                                              _bus_license_plate,
                                              _datetime_start),
                      {})

    def __init__(self, driver_id, bus_license_plate, current_status=DeploymentStatus.PREDEPLOYMENT):
        self._driver_id = int(driver_id)
        self._bus_license_plate = bus_license_plate
        self._datetime_start = datetime.now() + timedelta(seconds=30)
        self._datetime_end = None
        self._current_status = current_status
        if current_status==DeploymentStatus.PREDEPLOYMENT:
            driver = [R for R in db.session.execute(db.select(Account)).scalars().all()
                      if (R.uid == int(driver_id))][0]
            driver.driver_status = DriverStatus.GOING_BUS
        db.session.add(self)
        db.session.commit()
        db.session.add(DeploymentStatusLogEntry(self._uid, self._current_status))
        db.session.commit()

    def __repr__(self):
        return f'<Deployment of Bus {self._bus_license_plate} from {self._datetime_start} to {self._datetime_end}>'

    @property
    def driver_id(self):
        return self._driver_id

    @property
    def bus_license_plate(self):
        return self._bus_license_plate

    @property
    def datetime_start(self):
        return self._datetime_start

    @property
    def datetime_end(self):
        return self._datetime_end

    @property
    def current_status(self):
        return self._current_status.value

    @property
    def uid(self):
        return self._uid

    @property
    def available_statuses(self):
        if self._current_status == DeploymentStatus.PREDEPLOYMENT:
            return [DeploymentStatus.BUFFER_TIME, DeploymentStatus.CANCELLED]
        elif self._current_status == DeploymentStatus.BUFFER_TIME:
            return [DeploymentStatus.ONGOING, DeploymentStatus.CANCELLED]
        elif self._current_status == DeploymentStatus.ONGOING:
            return [DeploymentStatus.COMPLETED, DeploymentStatus.CANCELLED]
        else:
            return None

    @property
    def available_actions(self):
        if self._current_status == DeploymentStatus.PREDEPLOYMENT:
            return ["Approve", "Cancel"]
        elif self._current_status == DeploymentStatus.BUFFER_TIME:
            return ["Start", "Cancel"]
        elif self._current_status == DeploymentStatus.ONGOING:
            return ["Complete", "Cancel"]
        else:
            return None

    def early_approve(self):
        if self._current_status == DeploymentStatus.PREDEPLOYMENT:
            self._current_status = DeploymentStatus.BUFFER_TIME
            self._datetime_end = datetime.now()
            db.session.commit()
            return True
        else:
            return False

    def cancel(self):
        if self._current_status == DeploymentStatus.PREDEPLOYMENT or self._current_status == DeploymentStatus.BUFFER_TIME:
            self.new_status(DeploymentStatus.CANCELLED)
            driver = [R for R in db.session.execute(db.select(Account)).scalars().all()
                      if (R.uid == self._driver_id)][0]
            driver.driver_status = DriverStatus.ON_BREAK
            self._datetime_end = datetime.now()
            if self._datetime_start < self._datetime_end:
                self._datetime_start = self._datetime_end
            db.session.commit()
            return True
        else:
            return False

    def new_status(self, new_status):
        if not isinstance(new_status, DeploymentStatus):
            raise ValueError('new_status must be an instance of DeploymentStatus')
        if self._current_status == DeploymentStatus.PREDEPLOYMENT:
            if (
                    new_status == DeploymentStatus.PREDEPLOYMENT or
                    new_status == DeploymentStatus.ONGOING or
                    new_status == DeploymentStatus.COMPLETED
                ):
                raise InvalidStatusChangeException('Deployment in predeployment can only be cancelled or put into buffer time.')
            elif new_status == DeploymentStatus.CANCELLED:
                self._datetime_end = datetime.now()
                self._current_status = DeploymentStatus.CANCELLED
                db.session.add(DeploymentStatusLogEntry(self._uid,
                                                        self._current_status))
                db.session.commit()
                return
            elif new_status == DeploymentStatus.BUFFER_TIME:
                self._current_status = DeploymentStatus.BUFFER_TIME
                db.session.add(DeploymentStatusLogEntry(self._uid,
                                                        self._current_status))
                [R for R in db.session.execute(db.select(Account)).scalars().all()
                if R.uid == self._driver_id][0].driver_status = DriverStatus.GOING_BUS
                db.session.commit()
                return
        elif self._current_status == DeploymentStatus.BUFFER_TIME:
            if (
                    new_status == DeploymentStatus.PREDEPLOYMENT or
                    new_status == DeploymentStatus.BUFFER_TIME or
                    new_status == DeploymentStatus.COMPLETED
                ):
                raise InvalidStatusChangeException('Deployment in predeployment can only be cancelled or put ongoing.')
            elif new_status == DeploymentStatus.CANCELLED:
                self._datetime_end = datetime.now()
                self._current_status = DeploymentStatus.CANCELLED
                db.session.add(DeploymentStatusLogEntry(self._uid,
                                                        self._current_status))
                [R for R in db.session.execute(db.select(Account)).scalars().all()
                 if R.uid == self._driver_id][0].driver_status = DriverStatus.ON_BREAK
                db.session.commit()
                return
            elif new_status == DeploymentStatus.ONGOING:
                self._current_status = DeploymentStatus.ONGOING
                db.session.add(DeploymentStatusLogEntry(self._uid,
                                                        self._current_status))
                [R for R in db.session.execute(db.select(Account)).scalars().all()
                 if R.uid == self._driver_id][0].driver_status = DriverStatus.DRIVING
                [R for R in db.session.execute(db.select(Bus)).scalars().all()
                 if R.license_plate == self._bus_license_plate][0].current_status = BusStatus.ON_ROUTE
                db.session.commit()
                return
        elif self._current_status == DeploymentStatus.ONGOING:
            if (
                    new_status == DeploymentStatus.PREDEPLOYMENT or
                    new_status == DeploymentStatus.BUFFER_TIME or
                    new_status == DeploymentStatus.ONGOING or
                    new_status == DeploymentStatus.CANCELLED
                ):
                raise InvalidStatusChangeException('Deployment in predeployment can only be completed.')
            elif new_status == DeploymentStatus.COMPLETED:
                self._datetime_end = datetime.now()
                self._current_status = DeploymentStatus.COMPLETED
                db.session.add(DeploymentStatusLogEntry(self._uid,
                                                        self._current_status))
                [R for R in db.session.execute(db.select(Account)).scalars().all()
                 if R.uid == self._driver_id][0].driver_status = DriverStatus.ON_BREAK
                [R for R in db.session.execute(db.select(Bus)).scalars().all()
                 if R.license_plate == self._bus_license_plate][0].current_status = BusStatus.IN_DEPOT
                db.session.commit()
                return

    @property
    def service_number(self):
        bus = db.session.execute(text(f"SELECT * FROM busbuddy.bus WHERE license_plate='{self._bus_license_plate}'")).all()[0]
        return bus.service_number

    @property
    def driver_name(self):
        driver = db.session.execute(text(f"SELECT * FROM busbuddy.account WHERE id='{self._driver_id}'")).all()[0]
        return driver.name

    def json(self):
        return {
            'driver_id': self._driver_id,
            'bus_license_plate': self._bus_license_plate,
            'datetime_start': self._datetime_start,
            'datetime_end': self._datetime_end,
            'current_status': self._current_status.value,
            'uid': self._uid,
            'service_number': self.service_number,
            'driver_name': self.driver_name
        }