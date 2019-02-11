import Expo from 'expo';

const { manifest } = Expo.Constants;
const devIp = manifest.debuggerHost && manifest.debuggerHost.split(':').shift();

export default {
  devHost: `http://${devIp}:8080/api`,
  prodHost: 'http://webapp.isecp.de/api',
  // manifest.packagerOpts is available in dev mode
  devMode: !!manifest.packagerOpts,
  loggerHost: 'http://log-collector.isecp.de/api/log',
};
