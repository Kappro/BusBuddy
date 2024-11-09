/**
 * Driver Status enumeration modelled from database.
 */
enum DriverStatus {
  OFF_WORK = "OFF_WORK",
  ON_BREAK = "ON_BREAK",
  GOING_BUS = "GOING_BUS",
  DRIVING = "DRIVING"
}

/**
 * Access enumeration modelled from database.
 */
export enum Access {
  MANAGER = "MANAGER",
  DRIVER = "DRIVER",
  BADACCOUNT = 0
}

/**
 * Account class modelled from database.
 */
export class Account {
  /**
   * UID of user.
   */
  uid: number;
  /**
   * Name of user.
   */
  name: string;
  /**
   * Hashed password using hash function.
   */
  password_hashed: string;
  /**
   * Email of user.
   */
  email: string;
  /**
   * Access of user. Either DRIVER or MANAGER.
   */
  access: Access;
  /**
   * Driver Status of user. If MANAGER, driver_status does not exist.
   */
  driver_status?: DriverStatus;
  /**
   * Date and time of registration into database.
   */
  datetime_registered: Date;

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
  object_test() {
    console.log("Function done")
  }
}
