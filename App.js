import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Image,
  NativeModules,
} from 'react-native';
import {
  AppLoading,
  Asset,
  Font,
  Icon,
  Permissions,
} from 'expo';
import { observable, reaction } from 'mobx';
import { observer, Provider } from 'mobx-react/native';
import AppNavigator from './navigation/AppNavigator';
import Alert from './components/Alert';
import lib from './helpers/lib';

import UserStore from './store/User';
import DevSettingsStore from './store/DevSettings';
import NextShiftStore from './store/NextShift';
import CurrentShiftStore from './store/CurrentShift';
import ShiftScheduleStore from './store/ShiftSchedule';
import ChatStore from './store/Chat';
import IssuesStore from './store/Issues';
import AlertStore from './store/Alert';

const userStore = global.userStore = new UserStore();
const devSettingsStore = global.devSettings = new DevSettingsStore();
const nextShiftStore = global.nextShift = new NextShiftStore();
const currentShiftStore = global.currentShift = new CurrentShiftStore();
const shiftScheduleStore = new ShiftScheduleStore();
const chatStore = new ChatStore();
const issuesStore = global.issues = new IssuesStore();
const alertStore = global.alertNotification = new AlertStore();

const { UIManager } = NativeModules;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

@observer
class App extends React.Component {
  @observable isLoadingComplete = false;

  @observable initialRoute = 'Auth';

  constructor() {
    super();

    // react to user authentication status changes
    reaction(
      () => userStore.authenticated,
      authenticated => authenticated && this.onUserLoggedIn(),
    );
  }

  componentDidMount() {
    // initially ask for permissions to use the notifiactions and location service
    // if they not have been granted already
    lib.isPermissionGranted(Permissions.NOTIFICATIONS);
    lib.isPermissionGranted(Permissions.LOCATION);
  }

  /**
   * Called on app start. Loads required assets and sets up
   * certain stores like the UserStore to initialize the user model.
   */
  loadResourcesAsync = async () => Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
      require('./assets/images/unlock.gif'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Icon.Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free
      // to remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      'nemode': require('./assets/fonts/nemode.ttf'),
    }),
    userStore.init(),
    devSettingsStore.init(),
  ]);

  handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.isLoadingComplete = true;
    this.initialRoute = userStore.authenticated ? 'Main' : 'Auth';
  };

  /**
   * Callback is called after the user has been authenticated.
   * This happens either on app start when the user model is loaded and
   * has been considered as authenticated or when the user loggs in successfully.
   */
  onUserLoggedIn = () => {
    chatStore.load();
  }

  render() {
    const { skipLoadingScreen } = this.props;

    if (!this.isLoadingComplete && !skipLoadingScreen) {
      return (
        <View style={styles.splashContainer}>
          <AppLoading
            startAsync={this.loadResourcesAsync}
            onError={this.handleLoadingError}
            onFinish={this.handleFinishLoading}
          />
          <Image
            style={styles.splashImage}
            source={require('./assets/images/background_van.jpg')}
          />
        </View>
      );
    }
    return (
      <Provider
        user={userStore}
        devSettings={devSettingsStore}
        nextShift={nextShiftStore}
        currentShift={currentShiftStore}
        shiftSchedule={shiftScheduleStore}
        chat={chatStore}
        issues={issuesStore}
        alert={alertStore}
      >
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          <AppNavigator
            initialRoute={this.initialRoute}
          />
          <Alert />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  splashImage: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
});

export default App;
