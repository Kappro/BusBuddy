enum DriverStatus {
  OFF_WORK,
  ON_BREAK,
  GOING_BUS,
  DRIVING
}

enum Access {
  MANAGER,
  DRIVER
}

export class Account {
  name: string;
  password_hashed: string;
  email: string;
  access: Access;
  driver_status?: DriverStatus;

  constructor(name: string, password_hashed: string, email: string, access: Access, driver_status?: DriverStatus) {
    this.name = name;
    this.password_hashed = password_hashed;
    this.email = email;
    this.access = access;
    if(typeof driver_status !== "undefined") {
      this.driver_status = driver_status;
    }
    else {
      this.driver_status = undefined;
    }
    if(access == Access.MANAGER) {
      this.driver_status = undefined;
    }
  }
}
