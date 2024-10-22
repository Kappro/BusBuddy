from ..models.accounts.account import Account


class BusDriver(Account):
    def __init__(self, name, username, password, UID, current_status):
        super().__init__(name, username, password, UID, current_status)

    # Method to view driving history (public in Java, convention in Python with underscore)
    def view_driving_history(self):
        # Logic for viewing driving history goes here
        pass

    # Method to view driving route (public in Java, underscore in Python)
    def view_driving_route(self):
        # Logic for viewing driving route goes here
        pass

    # Method to view announcements (public in Java, underscore in Python)
    def view_announcements(self):
        # Logic for viewing announcements goes here
        pass