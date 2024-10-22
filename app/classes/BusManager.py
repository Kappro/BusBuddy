from ..models.accounts.account import Account

class BusManager(Account):
    def __init__(self, name, username, password, UID):
        super().__init__(name, username, password, UID)  # Calls the parent class constructor

    # Method for managing bus deployment
    def manage_bus_deployment(self, username):
        # Logic for managing bus deployment goes here
        pass

    # Method for managing bus deployment route
    def manage_bus_deployment_route(self, bus_service):
        # Logic for managing bus deployment route goes here
        pass

    # Method for viewing bus driver details
    def view_bus_driver(self, username):
        # Logic for viewing bus driver details goes here
        pass

    # Method for adding a bus driver
    def add_bus_driver(self, name, username):
        # Logic for adding a new bus driver goes here
        pass

    # Method for editing bus driver details
    def edit_bus_driver(self, username):
        # Logic for editing bus driver details goes here
        pass

    # Method for approving a bus deployment request
    def approve_bus_deployment_request(self, bus_service):
        # Logic for approving bus deployment request goes here
        pass

    # Method for canceling a bus deployment request
    def cancel_bus_deployment_request(self, bus_service):
        # Logic for canceling bus deployment request goes here
        pass
