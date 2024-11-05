from hashlib import sha256

from ..shared import db
from enum import Enum
from datetime import datetime


class DriverStatus(Enum):
    OFF_WORK = "Off Work"
    RESERVED = "Reserved for Drive"
    ON_BREAK = "On Break"
    GOING_BUS = "Going to Bus"
    DRIVING = "Driving"

class AccountAccess(Enum):
    MANAGER = "Manager"
    DRIVER = "Driver"


class Account(db.Model):
    __tablename__ = 'account'

    _uid = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    _password_hashed = db.Column('password_hashed', db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.Integer, nullable=False)
    _access = db.Column('type', db.Enum(AccountAccess), nullable=False)
    _driver_status = db.Column('driver_status', db.Enum(DriverStatus), nullable=True)
    _datetime_registered = db.Column('datetime_registered', db.DateTime, nullable=False)

    def __init__(self, name, password, email, contact, access, driver_status=DriverStatus.OFF_WORK):
        self.name = name
        self._password_hashed = sha256(password.encode('utf-8')).hexdigest()
        self.email = email
        self.contact = contact
        self._access = access
        if self._access.value == "Driver":
            self._driver_status = driver_status
        else:
            self._driver_status = None
        self._datetime_registered = datetime.now()
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return f'<Account of {self._access.value} {self.name}>'

    @property
    def uid(self):
        return self._uid

    @property
    def password_hashed(self):
        return self._password_hashed

    def new_password(self, password):
        self._password_hashed = sha256(password.encode('utf-8')).hexdigest()
        db.session.commit()

    @property
    def access(self):
        return self._access
    @access.setter
    def access(self, new_access):
        if new_access == self._access or not isinstance(new_access, AccountAccess):
            return
        self._access = new_access
        db.session.commit()

    @property
    def driver_status(self):
        return self._driver_status
    @driver_status.setter
    def driver_status(self, new_status):
        if new_status == self._driver_status or not isinstance(new_status, DriverStatus) or self._access == AccountAccess.MANAGER:
            return
        self._driver_status = new_status
        db.session.commit()

    @property
    def datetime_registered(self):
        return self._datetime_registered

    def json(self):
        if self._access == AccountAccess.MANAGER:
            return {
                'uid': self.uid,
                'name': self.name,
                'password_hashed': self._password_hashed,
                'email': self.email,
                'type': self._access.name,
                'datetime_registered': self._datetime_registered,
                'driver_status': None,
            }
        else:
            return {
                'uid': self.uid,
                'name': self.name,
                'password_hashed': self._password_hashed,
                'email' : self.email,
                'type' : self._access.name,
                'datetime_registered' : self._datetime_registered,
                'driver_status' : self._driver_status.name,
            }