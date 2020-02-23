import { serverIP } from '../config'

/**
 * @desc define some constant values here. Include frontend API root address, session signout time,
 * events array and RegExps for validating username, password, and email.
 */

export const SERVERIP = serverIP;

export const FRONTEND_API = SERVERIP + "/frontend/";

export const BACKEND_API = SERVERIP + "/backend/";

// export const FRONTEND_API = "http://localhost:3001/" + "frontend/";

// export const BACKEND_API = "http://localhost:3000/" + "backend/";

export const SESSION_SIGNOUT_TIME = 1000 * 60 * 60;

export const FETCH_DATA_INTERVAL = 1000 * 60;

export const ALERT_SIGNOUT_MSG = "Time is up. Please log in again.";

export const EVENTS = [ 'mousemove', 'mousedown', 'load', 'click', 'scroll', 'keypress'];

export const USERNAME_CHECK = "^[a-zA-Z0-9_]{4,16}$";

export const PASSWORD_CHECK = "^.*(?=.{6,})(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$";

export const EMAIL_CHECK = "[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?"

export const RESETPWD_SUCCESS_MSG = "Email verified successfully. Please check your email and follow it to reset your password."

export const COLORS = ["#4D96CC", "#98B1C4", "#2F4858", "#96A3AB", "#8ADB92", "#C4EDC8", "#DEA16F", "#EED0B6", "#E8E288"]

export const INVESTMENT_USER = "investment_user"
