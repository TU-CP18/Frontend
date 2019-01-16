import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import {
  AppLoading,
  Asset,
  Font,
  Icon,
} from 'expo';
import { observable } from 'mobx';
import { observer, Provider } from 'mobx-react/native';
import AppNavigator from './navigation/AppNavigator';

import UserStore from './store/User';
import DevSettingsStore from './store/DevSettings';
import NextShiftStore from './store/NextShift';
import ShiftScheduleStore from './store/ShiftSchedule';
import ChatStore from './store/Chat';
import IssuesStore from './store/Issues';

const userStore = global.userStore = new UserStore();
const devSettingsStore = global.devSettings = new DevSettingsStore();
const nextShiftStore = new NextShiftStore();
const shiftScheduleStore = new ShiftScheduleStore();
const chatStore = new ChatStore();
const issuesStore = global.issues = new IssuesStore();

chatStore.load();

@observer
class App extends React.Component {
  @observable isLoadingComplete = false;

  @observable initialRoute = 'Auth';

  loadResourcesAsync = async () => Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
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
        shiftSchedule={shiftScheduleStore}
        chat={chatStore}
        issues={issuesStore}
      >
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          <AppNavigator
            initialRoute={this.initialRoute}
          />
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
    // height: '100%',
    // resizeMode: 'cover',
  },
});

export default App;
