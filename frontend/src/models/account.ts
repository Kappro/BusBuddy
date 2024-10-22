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
    this.driver_status
  }
}
