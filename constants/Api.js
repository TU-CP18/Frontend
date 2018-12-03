import Expo from 'expo';

const { manifest } = Expo.Constants;

// manifest.packagerOpts is available in dev mode
const host = manifest.packagerOpts
  ? manifest.debuggerHost.split(':').shift()
  : '13.80.251.160';

export default {
  host: `http://${host}:8080/api`,
};
