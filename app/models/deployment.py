from ..shared import db
from datetime import datetime
from enum import Enum

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

    _driver_id = db.Column('DEPLOYMENT_LOG_ACCOUNT_id', db.Integer, db.ForeignKey('deployment_log.ACCOUNT_id'), primary_key=True)
    _bus_license_plate = db.Column('DEPLOYMENT_LOG_BUS_license_plate', db.String(10), db.ForeignKey('deployment_log.BUS_license_plate'), primary_key=True)
    _datetime_start = db.Column('DEPLOYMENT_LOG_datetime_start', db.DateTime, db.ForeignKey('deployment_log.datetime_start'), primary_key=True)
    _new_status = db.Column('new_status', db.Enum(DeploymentStatus), nullable=False)
    _datetime_changed = db.Column('datetime_changed', db.DateTime, nullable=False)

    def __init__(self, driver_id, bus_license_plate, datetime_start, new_status):
        self._driver_id = driver_id
        self._bus_license_plate = bus_license_plate
        self._datetime_start = datetime_start
        self._new_status = new_status
        self._datetime_changed = datetime.now()
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return f'<Deployment of {self.bus_license_plate}, started at {self._datetime_start}, changed to {self.new_bus_status} at {self.datetime_changed}>'

    def json(self):
        return {
            'driver_id': self._driver_id,
            'bus_license_plate': self._bus_license_plate,
            'datetime_start': self._datetime_start,
            'new_status': self._new_status,
            'datetime_changed': self._datetime_changed
        }


class Deployment(db.Model):
    __tablename__ = 'deployment_log'

    _driver_id = db.Column('ACCOUNT_id', db.Integer, db.ForeignKey('bus.license_plate'), primary_key=True)
    _bus_license_plate = db.Column('BUS_license_plate', db.String(10), db.ForeignKey('bus.license_plate'), primary_key=True)
    _datetime_start = db.Column('datetime_start', db.DateTime, primary_key=True)
    _datetime_end = db.Column('datetime_end', db.DateTime, nullable=True)
    _current_status = db.Column('current_status', db.Enum(DeploymentStatus), nullable=False)
    status_log = db.relationship('DeploymentStatusLog', backref='deployment_log', lazy=True)

    def __init__(self, driver_id, bus_license_plate, current_status=DeploymentStatus.PREDEPLOYMENT):
        self._driver_id = driver_id
        self._bus_license_plate = bus_license_plate
        self._datetime_start = datetime.now()
        self._datetime_end = None
        self._current_status = current_status
        db.session.add(self)
        db.session.add(DeploymentStatusLogEntry(self._driver_id, self._bus_license_plate, self._datetime_start, self._current_status))
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
                db.session.add(DeploymentStatusLogEntry(self._driver_id, self._bus_license_plate, self._datetime_start, self._current_status))
                db.session.commit()
                return
            elif new_status == DeploymentStatus.BUFFER_TIME:
                self._current_status = DeploymentStatus.BUFFER_TIME
                db.session.add(DeploymentStatusLogEntry(self._driver_id, self._bus_license_plate, self._datetime_start,
                                                        self._current_status))
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
                db.session.add(DeploymentStatusLogEntry(self._driver_id, self._bus_license_plate, self._datetime_start,
                                                        self._current_status))
                db.session.commit()
                return
            elif new_status == DeploymentStatus.ONGOING:
                self._current_status = DeploymentStatus.ONGOING
                db.session.add(DeploymentStatusLogEntry(self._driver_id, self._bus_license_plate, self._datetime_start,
                                                        self._current_status))
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
                db.session.add(DeploymentStatusLogEntry(self._driver_id, self._bus_license_plate, self._datetime_start,
                                                        self._current_status))
                db.session.commit()
                return

    def json(self):
        return {
            'driver_id': self._driver_id,
            'bus_license_plate': self._bus_license_plate,
            'datetime_start': self._datetime_start,
            'datetime_end': self._datetime_end,
            'current_status': self._current_status.value,
        }