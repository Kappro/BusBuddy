from ..shared import db
from .load import Load

service_stop_connection = db.Table('service_bus_stops', db.Model.metadata,
                                    db.Column('service_number', db.String(10), db.ForeignKey('services.service_number')),
                                    db.Column('bus_stop_code', db.Integer, db.ForeignKey('bus_stop.stop_code')),
                                    db.Column('sequence_number', db.Integer, nullable=False),
                                    __table_args__ = (db.PrimaryKeyConstraint(
                                        'service_number', 'bus_stop_code', 'sequence_number'
                                    ), {})
                                   )

class Service(db.Model):
    __tablename__ = 'service'

    service_number = db.Column(db.String(10), primary_key=True)

    def __init__(self, service_number):
        self.service_number = service_number
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return f'<Service {self.service_number}>'

    @property
    def stops(self) -> list:
        stops_list = db.session.execute(db.select(service_stop_connection).filter_by(service_number = self.service_number)).all()
        return [str(R.bus_stop_code) for R in stops_list]

    def json(self):
        return {
            'service_number': self.service_number,
        }

class Stop(db.Model):
    __tablename__ = 'bus_stop'

    stop_code = db.Column(db.Integer, primary_key=True)
    stop_name = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    _current_load = db.Column('current_load',db.Enum(Load), nullable=False)


    def __init__(self, code, name, latitude, longitude, current_load=Load.LOW):
        self.stop_code = code
        self.stop_name = name
        self.latitude = latitude
        self.longitude = longitude
        self._current_load = current_load
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return f'<Stop {self.name}>'

    @property
    def current_load(self):
        return self._current_load
    @current_load.setter
    def current_load(self, new_load: Load):
        if new_load == self.current_load or not isinstance(new_load, Load):
            return
        self._current_load = new_load
        db.session.commit()

    def add_service(self, service_number, sequence_number):
        db.session.execute(db.insert(service_stop_connection)
                           .values(service_number=service_number,
                                   bus_stop_code=self.stop_code,
                                   sequence_number=sequence_number))
        db.session.commit()

    def json(self):
        return {
            'stop_code': self.stop_code,
            'stop_name': self.stop_name,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'current_load': self.current_load.value
        }