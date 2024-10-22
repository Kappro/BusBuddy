from abc import ABC, abstractmethod

class Account(ABC):
    def __init__(self, name, username, password, UID):
        self._name = name
        self._username = username
        self._password = password
        self._UID = UID

    # Getter and setter for name
    def set_name(self, name):
        self._name = name

    def get_name(self):
        return self._name

    # Getter and setter for username
    def set_username(self, username):
        self._username = username

    def get_username(self):
        return self._username

    # Setter for password (no getter for password for security reasons)
    def set_password(self, password):
        self._password = password

    # Getter for UID (no setter for UID, assuming it is set once)
    def get_UID(self):
        return self._UID