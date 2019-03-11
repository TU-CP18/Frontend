import Expo from 'expo';

const { manifest } = Expo.Constants;
const devIp = manifest.debuggerHost && manifest.debuggerHost.split(':').shift();

export default {
  apiDev: `http://${devIp}:8080/api`,
  apiProd: 'http://webapp.isecp.de/api',
  websocketDev: `http://${devIp}:8080/websocket`,
  websocketProd: 'http://webapp.isecp.de/websocket',
  // manifest.packagerOpts is available in dev mode
  devMode: !!manifest.packagerOpts,
  loggerHost: 'http://log-collector.isecp.de/api/log',
};
