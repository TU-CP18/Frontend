import { Permissions } from 'expo';

const isPermissionGranted = async permission => {
  const { status } = await Permissions.askAsync(permission);
  return (status === 'granted');
};

const hasPermission = async permission => {
  const { status } = await Permissions.getAsync(permission);
  return (status === 'granted');
};

export default {
  isPermissionGranted,
  hasPermission,
};
