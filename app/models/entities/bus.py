from ..shared import db
from .load import Load
from datetime import datetime
from enum import Enum

class BusStatus(Enum):
    UNSERVICEABLE = "Unserviceable"
    RESERVED = "Reserved"
    IN_DEPOT = "In Depot"
    TRAINING = "Training"
    ON_ROUTE = "On Route"
    RETURNING = "Returning"


# class BusStatusLogEntry(db.Model):
#     __tablename__ = 'bus_status_log'
#
#     bus_license_plate = db.Column('BUS_license_plate', db.String, db.ForeignKey('bus.license_plate'), primary_key=True)
#     datetime_changed = db.Column('datetime_changed', db.DateTime, primary_key=True)
#     new_bus_status = db.Column('new_bus_status', db.Enum(BusStatus), nullable=False)
#
#     def __init__(self, bus_license_plate, new_bus_status):
#         self.bus_license_plate = bus_license_plate
#         self.new_bus_status = new_bus_status
#         self.datetime_changed = datetime.now()
#
#     def __repr__(self):
#         return f'<Bus {self.bus_license_plate} changed to {self.new_bus_status} at {self.datetime_changed}>'
#
#     def json(self):
#         return {
#             'bus_license_plate': self.bus_license_plate,
#             'datetime_changed': self.datetime_changed,
#             'new_bus_status': self.new_bus_status
#         }


class Bus(db.Model):
    __tablename__ = 'bus'

    license_plate = db.Column('license_plate', db.String(10), primary_key=True)
    capacity = db.Column('capacity', db.Integer, nullable=False)
    _current_load = db.Column('current_load',db.Enum(Load), nullable=False, default=Load.LOW)
    service_number = db.Column(db.String(10), db.ForeignKey('service.service_number'), nullable=True)
    _current_status = db.Column('current_status',db.Enum(BusStatus), nullable=False, default=BusStatus.IN_DEPOT)

    def __init__(self,
                 license_plate: str,
                 capacity: int,
                 service_number: str,
                 current_load: Load = Load.LOW,
                 current_status: BusStatus = BusStatus.IN_DEPOT) -> None:
        self.license_plate = license_plate
        self.capacity = capacity
        self._current_load = current_load
        self.service_number = service_number
        self._current_status = current_status
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return f'<Bus: {self.license_plate}>'

    @property
    def current_load(self) -> Load:
        return self._current_load
    @current_load.setter
    def current_load(self, new_load: Load) -> None:
        if new_load == self.current_load or not isinstance(new_load, Load):
            return
        self._current_load = new_load
        db.session.commit()

    @property
    def current_status(self):
        return self._current_status
    @current_status.setter
    def current_status(self, new_status: BusStatus) -> None:
        if new_status == self._current_status:
            return
        elif not isinstance(new_status, BusStatus):
            raise ValueError("new_status must be an instance of BusStatus.")
        self._current_status = new_status
        db.session.commit()

    def json(self):
        return {
            'service_number': self.service_number,
            'capacity': self.capacity,
            'current_load': self.current_load.value,  # Convert enum to string for JSON
            'current_status': self.current_status.value,  # Convert enum to string for JSON
            'license_plate': self.license_plate
        }