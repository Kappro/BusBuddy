enum DriverStatus {
  OFF_WORK = "OFF_WORK",
  ON_BREAK = "ON_BREAK",
  GOING_BUS = "GOING_BUS",
  DRIVING = "DRIVING"
}

export enum Access {
  MANAGER = "MANAGER",
  DRIVER = "DRIVER",
  BADACCOUNT = 0
}

export class Account {
  uid: number;
  name: string;
  password_hashed: string;
  email: string;
  access: Access;
  driver_status?: DriverStatus;
  datetime_registered: Date;

  constructor(uid: number, name: string, password_hashed: string, email: string, access: Access, datetime_registered: Date, driver_status?: DriverStatus) {
    this.uid = uid;
    this.name = name;
    this.password_hashed = password_hashed;
    this.email = email;
    this.access = access;
    this.datetime_registered = datetime_registered;
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

  object_test() {
    console.log("Function done")
  }
}
