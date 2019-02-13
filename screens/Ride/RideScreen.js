import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Vibration,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Audio } from 'expo';
import { observer, inject } from 'mobx-react';
import { FontAwesome } from '@expo/vector-icons';
import Button from '../../components/Button';
import MapRoute from '../../components/MapRoute';
import asyncSleep from '../../helpers/asyncSleep';
import logger from '../../helpers/logger';

@inject('user', 'chat', 'currentShift')
@observer
class RideScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();

    this.state = {
      nextStopShift: false,
      nextStopShiftReached: false,
      pauseNavigation: false,
      countdown: (global.devSettings.settings.get('demoAwarenessCheck')) ? 15 : 30,
    };
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  onPressStartRide = () => {
    const { currentShift } = this.props;
    currentShift.startRide();
    this.setState({ nextStopShift: true });
    this.startCountdown();
  };

  /**
   * When pressing the incident button, show a confirmation dialog
   * to clearly make sure that an emergency exists.
   */
  onPressReportIncident = () => {
    Alert.alert(
      'Emergency Confirmation',
      'Do you want to report an emergency? The car will stop the current ride if you confirm.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Stop Car',
          onPress: this.onConfirmReportIncident,
        },
      ],
      { cancelable: false },
    );
  };

  /**
   * When confirming an incident, track the event
   * and open the incident screen.
   */
  onConfirmReportIncident = () => {
    const { navigation } = this.props;
    navigation.navigate('Incident');
    logger.slog(logger.NAV_ESTOP);
  };

  onDestinationReached = () => {
    const { currentShift } = this.props;
    currentShift.finishRide();
    this.setState({ nextStopShiftReached: true });
  };

  onPhaseTextPressed = () => {
    if (!global.devSettings.settings.get('fakeNavigation')) {
      // only used for simulating navigation
      return;
    }
    const { pauseNavigation } = this.state;
    this.setState({ pauseNavigation: !pauseNavigation });
  };

  startCountdown = () => {
    this.countdown = setInterval(() => {
      this.decrementCountdown();
    }, 1000);
  };

  decrementCountdown = () => {
    const { countdown } = this.state;
    if (countdown === 0) {
      clearInterval(this.countdown);
      if (global.devSettings.settings.get('demoAwarenessCheck')) {
        // in the demo we skip vibration and immediately play the audio sound
        this.startAudio();
      } else {
        this.startVibration();
      }
    } else {
      this.setState(prevState => (
        { countdown: prevState.countdown - 1 }
      ));
    }
  };

  restartCountdown = () => {
    const { countdown } = this.state;
    logger.slog(logger.RIDE_AWARENESS_CHECKED);
    if (countdown > 0) {
      clearInterval(this.countdown);
    }
    // stop vibration
    Vibration.cancel();
    clearInterval(this.vibration);
    // stop potential audio
    if (this.soundObject) {
      this.soundObject.stopAsync();
    }
    this.setState({
      countdown: (global.devSettings.settings.get('demoAwarenessCheck')) ? 15 : 30,
    });
    this.startCountdown();
  };

  startVibration = () => {
    const { nextStopShiftReached } = this.state;
    if (nextStopShiftReached) {
      // safety driver is at destination, so awareness does not need to be checked anymore
      return;
    }
    if (Platform.OS === 'android') {
      // vibrate for 30 seconds
      Vibration.vibrate(30000);
      this.startAudio();
    }
    if (Platform.OS === 'ios') {
      // vibrate for 30 seconds
      let i = 1;
      this.vibration = setInterval(() => {
        Vibration.vibrate(500);
        i++;
        if (i === 50) {
          Vibration.cancel();
          clearInterval(this.vibration);
          this.startAudio();
        }
      }, 600);
    }
  };

  startAudio = async () => {
    const { countdown, nextStopShiftReached } = this.state;
    if (countdown > 0 || nextStopShiftReached) {
      // user has swiped the button during vibration
      // safety driver is at destination, so awareness does not need to be checked anymore
      return;
    }
    this.soundObject = new Audio.Sound();
    try {
      await this.soundObject.loadAsync(require('../../assets/sounds/hello.mp3'));
      await this.soundObject.playAsync();
      await this.soundObject.setIsLoopingAsync(true);
      // play it for 30 seconds
      await asyncSleep(30000);
      if (this.soundObject) {
        this.soundObject.stopAsync();
      }
    } catch (error) {
      console.error(error);
    }
    this.sendNotificationToFleetManager();
  };

  sendNotificationToFleetManager = () => {
    const { chat, user } = this.props;
    const { countdown, nextStopShiftReached } = this.state;
    if (countdown > 0 || nextStopShiftReached) {
      // user has swiped the button during audio
      // safety driver is at destination, so awareness does not need to be checked anymore
      return;
    }
    logger.slog(logger.RIDE_AWARENESS_IGNORED);
    // send message to fleet manager
    chat.sendMessage([{
      _id: Math.round(Math.random() * 1000000),
      text: 'I am currently unaware for more than one minute',
      createdAt: new Date(),
      user: {
        _id: user.id,
      },
    }]);
  };

  renderDriveModeButton = () => {
    const { navigation } = this.props;
    const { nextStopShiftReached, nextStopShift, countdown } = this.state;

    if (nextStopShiftReached) {
      // end of shift
      return (
        <Button
          title="Finish Ride"
          wrapperStyle={styles.modeButtonWrapper}
          onPress={() => navigation.navigate('RideCompletion')}
        />
      );
    }
    if (nextStopShift && !nextStopShiftReached) {
      return (
        <Button
          title={`Awareness Check ${countdown}`}
          iconLeft={require('../../assets/images/swipe-icon.png')}
          iconStyle={{
            resizeMode: 'contain', height: 25, width: 31.5, marginRight: 5,
          }}
          wrapperStyle={styles.modeButtonWrapper}
          onPress={this.restartCountdown}
        />
      );
    }
    return (
      <Button
        title="Start Ride"
        wrapperStyle={styles.modeButtonWrapper}
        onPress={this.onPressStartRide}
      />
    );
  };

  MenuButton = ({ title, subtitle, onPress, icon }) => (
    <Button
      title={title}
      subtitle={subtitle}
      onPress={onPress}
      iconLeft={icon}
      wrapperStyle={styles.buttonWrapper}
      containerStyle={styles.buttonContainer}
      iconStyle={styles.buttonIcon}
      titleStyle={styles.buttonText}
      subtitleStyle={styles.buttonSubtitle}
      textContainerStyle={styles.buttonTextContainer}
    />
  );

  renderControlButtons = () => {
    const { navigation } = this.props;

    return (
      <View style={styles.buttonGroup}>
        <this.MenuButton
          title="Car"
          subtitle="Control"
          onPress={() => navigation.navigate('Control')}
          icon="Ionicons/md-settings"
        />
        <this.MenuButton
          title="Report"
          subtitle="Incident"
          onPress={this.onPressReportIncident}
          icon="MaterialIcons/report"
        />
        <this.MenuButton
          title="Contact"
          subtitle="Manager"
          onPress={() => navigation.navigate('Contact')}
          icon="FontAwesome/phone"
        />
      </View>
    );
  };

  renderPhaseText = () => {
    const { nextStopShift, nextStopShiftReached } = this.state;
    if (nextStopShiftReached) {
      return 'Interchange point reached';
    }
    if (nextStopShift && !nextStopShiftReached) {
      return 'Drive to interchange point';
    }
    return 'Pickup Passenger';
  };

  render() {
    const { nextStopShift, pauseNavigation } = this.state;

    return (
      <View style={styles.container}>
        <MapRoute
          showNavigationButton={false}
          showConfirmationButton={false}
          isNavigation={nextStopShift}
          pauseNavigation={pauseNavigation}
          onDestinationReached={this.onDestinationReached}
          latitude={52.5246175}
          longitude={13.3701056}
          userLatitude={52.5228096}
          userLongitude={13.4087783}
          style={styles.mapPreview}
        />

        <TouchableOpacity style={styles.warningContainer} onPress={this.onPhaseTextPressed}>
          <View>
            <Text style={styles.warningText}>Next Stop</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome name="caret-right" size={30} style={styles.warningIcon} />
              <Text style={styles.warningTitle}>{this.renderPhaseText()}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.content}>
          {this.renderDriveModeButton()}
          {this.renderControlButtons()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapPreview: {
    width: '100%',
    flex: 1,
  },
  content: {
    backgroundColor: '#000000',
  },
  buttonGroup: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonWrapper: {
    width: '31.5%',
    height: 50,
  },
  buttonContainer: {
    borderRadius: 25,
    borderColor: '#ffffff',
    borderWidth: 1,
    backgroundColor: '#000000',
    flex: 1,
    justifyContent: 'flex-start',
  },
  buttonIcon: {
    marginRight: 6,
    color: '#ffffff',
  },
  buttonTextContainer: {
    marginTop: -2,
  },
  buttonText: {
    color: '#ffffff',
    alignSelf: 'flex-start',
  },
  buttonSubtitle: {
    color: '#ffffff',
    alignSelf: 'flex-start',
    paddingTop: 2,
  },
  warningContainer: {
    position: 'absolute',
    top: 50,
    left: '10%',
    right: '10%',
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 12,
  },
  warningIcon: {
    color: '#ffffff',
    marginRight: 5,
  },
  warningTitle: {
    fontSize: 19,
    color: '#ffffff',
  },
  warningText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modeButtonWrapper: {
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  modeButtonSubtitle: {
    fontSize: 18,
    alignSelf: 'center',
    marginTop: -5,
  },
});

export default RideScreen;
