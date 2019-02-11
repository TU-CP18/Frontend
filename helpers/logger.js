

import axios from 'axios';
import api from '../constants/Api';

/* VEHICLE event types */
const NAV_ESTOP = 'NAV_ESTOP';
const CONTROL_SET = 'CONTROL_SET';
const vehicleEvents = [NAV_ESTOP, CONTROL_SET];

/* DRIVER event types */

const SHIFT_INTERCEPTING = 'SHIFT_INTERCEPTING'; // The driver is looking for shift interception point
const SHIFT_CONFIRM_ARRIVAL = 'SHIFT_CONFIRM_ARRIVAL'; // The driver confirms the arrival at the vehicle location and starts the inspection.
const SHIFT_FINISH = 'SHIFT_FINISH'; // End the driver’s current shift.
const VEHICLE_OPEN = 'VEHICLE_OPEN'; // The driver has opened the vehicle.
const VEHICLE_CLOSE = 'VEHICLE_CLOSE'; // The driver has exited the vehicle.
const RIDE_START = 'RIDE_START'; // The driver is looking for shift interception point
const RIDE_FINISH = 'RIDE_FINISH'; // The driver has finished the ride either by reaching destination or due to shift end.
const RIDE_AWARENESS_CHECKED = 'RIDE_AWARENESS_CHECKED'; // The driver has been checked for awareness
const RIDE_AWARENESS_IGNORED = 'RIDE_AWARENESS_IGNORED'; // The driver ignored the awareness check

/**
 * Logs an event by calling the log api.
 *
 * @param {*} type
 */
const log = (type, additionalParams = {}) => {
  const options = {
    method: 'POST',
    url: api.loggerHost,
    responseType: 'json',
    headers: {},
  };

  let source = 'DRIVER';
  if (type in vehicleEvents) {
    source = 'VEHICLE';
  }

  options.data = {
    source: source,
    timestamp: Date.now(),
    type: type,
    hostname: `sd-mobile-device-${global.userStore.id}`,
    driverId: global.userStore.id,
    shiftId: global.currentShift.shiftId,
    vehicleId: global.nextShift.shift.car.id,
    ...additionalParams,
  };

  return axios(options);
};

/**
 * Soft log catches all errors. The caller does not care for success or failure.
 */
const slog = async (type, params) => {
  try {
    await log(type, params);
  } catch (error) {
    console.log(`error while logging event ${type}:`, error);
  }
};

// export all constans and the log method
// in that way it can be called via logger.log(logger.NAV_ESTOP);
// without importing the constants explicitely
export default {
  log,
  slog,
  NAV_ESTOP,
  CONTROL_SET,
  SHIFT_INTERCEPTING,
  SHIFT_CONFIRM_ARRIVAL,
  SHIFT_FINISH,
  VEHICLE_OPEN,
  VEHICLE_CLOSE,
  RIDE_START,
  RIDE_FINISH,
  RIDE_AWARENESS_CHECKED,
  RIDE_AWARENESS_IGNORED,
};
