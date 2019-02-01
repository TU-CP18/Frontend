import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import { when } from 'mobx';
import * as Animatable from 'react-native-animatable';

import { BackgroundImage } from '../components/BackgroundImage';
import MapMarker from '../components/MapMarker';

@inject('user', 'nextShift')
@observer
class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    when(
      () => !props.user.authenticated,
      () => props.navigation.navigate('Auth'),
    );
  }

  async componentDidMount() {
    const { nextShift } = this.props;
    await nextShift.load();
  }

  handleCallOperator = () => {
    console.log('--> Will make a call');
  }

  handleLogout = () => {
    this.props.user.logout();
  }

  handleShiftSchedule = () => {
    this.props.navigation.navigate('Schedule');
  }

  renderIdleState() {
    const { user, navigation } = this.props;

    const { loading, shift } = this.props.nextShift;

    if (!loading && !shift) {
      return (
        <View style={{ flex: 1 }}>
          <Text style={[styles.messageText, { marginTop: 50 }]}>Hi {user.name},</Text>
          <Text style={[styles.messageText, { marginTop: 70 }]}>No shift scheduled</Text>
          <Text style={[styles.messageText, { marginTop: 10 }]}>in the next 30 mins</Text>
        </View>
      );
    }

    const mapButton = loading ? (
      <TouchableOpacity
        disabled
        style={{ alignItems: 'center', justifyContent: 'center' }}
        onPress={() => null}
      >
        <View style={styles.mapContainer} pointerEvents="none">
          <Animatable.View
            animation="rotate"
            easing="linear"
            iterationCount="infinite"
          >
            <Icon name="spinner-3" type="evilicon" />
          </Animatable.View>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={{ alignItems: 'center', justifyContent: 'center' }}
        onPress={() => navigation.navigate('NextShiftMap')}
      >
        <View style={styles.mapContainer} pointerEvents="none">
          <MapMarker coordinate={{ latitude: shift.latStart, longitude: shift.longStart }} />
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={{ flex: 1 }}>
        <Text style={[styles.messageText, { marginTop: 50 }]}>
          {`Hi ${user.name},`}
        </Text>
        {mapButton}
        {!loading
        && (
          <Text style={[styles.messageText]}>
            {`Head to ${shift.address.name}, ${shift.address.postalCode} ${shift.address.city}`}
          </Text>
        )}
        {!loading && (
          <Text style={styles.messageText}>
          by
            {` ${new Date(shift.start).toString()}`}
          </Text>
        )}
      </View>
    );
  }

  render() {
    const inner = (() => {
      // TODO: Add assignment store from which we derive the current assignment
      return this.renderIdleState();
    })();

    return (
      <KeyboardAvoidingView
        style={[styles.container, this.keyboardOpen ? styles.containerKeyboardOpen : {}]}
        behavior="padding"
        enabled
      >
        <BackgroundImage />
        {inner}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={this.handleShiftSchedule}
          >
            <View pointerEvents="none">
              <Icon
                name="calendar"
                color="#343434"
                type="font-awesome"
                containerStyle={styles.scheduleButton}
                iconStyle={styles.scheduleButtonIconStyle}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={this.handleLogout}
          >
            <View pointerEvents="none">
              <Icon
                name="gears"
                type="font-awesome"
                color="#343434"
                containerStyle={styles.settingsButton}
                iconStyle={styles.settingsButtonIconStyle}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={this.handleCallOperator}
          >
            <View pointerEvents="none">
              <Icon
                name="call"
                color="#343434"
                containerStyle={styles.callButton}
                iconStyle={styles.callButtonIconStyle}
              />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#343434',
  },
  messageText: {
    fontFamily: 'nemode',
    fontSize: 32,
    fontWeight: '600',
    color: '#fefefe',
    textAlign: 'center',
  },
  mapContainer: {
    marginTop: 25,
    marginBottom: 25,
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  callButton: {
    width: 75,
    height: 75,
    borderRadius: 75,
    backgroundColor: '#fefefe',
    opacity: 0.75,
  },
  callButtonIconStyle: {
    marginTop: 16,
    fontSize: 42,
  },
  scheduleButton: {
    width: 75,
    height: 75,
    borderRadius: 75,
    backgroundColor: '#fefefe',
    opacity: 0.75,
  },
  scheduleButtonIconStyle: {
    marginTop: 16,
    fontSize: 42,
  },
  settingsButton: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: '#fefefe',
    opacity: 0.75,
  },
  settingsButtonIconStyle: {
    marginTop: 16,
    fontSize: 42,
  },
});

export default HomeScreen;
