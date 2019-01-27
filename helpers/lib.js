import { Location, Permissions } from 'expo';

const isPermissionGranted = async permission => {
  const { status } = await Permissions.askAsync(permission);
  return (status === 'granted');
};

const hasPermission = async permission => {
  const { status } = await Permissions.getAsync(permission);
  return (status === 'granted');
};

/**
 * retrieve current gps coordinates
 * assumes that location permission has already been granted
 * @returns {Promise<{latitude: (number|*|string), longitude: (number|*|string)}>}
 */
const getLocation = async () => {
  // get current position if permission has been granted
  const { coords } = await Location.getCurrentPositionAsync({
    enableHighAccuracy: true,
  });

  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
};

export default {
  isPermissionGranted,
  getLocation,
  hasPermission,
};
