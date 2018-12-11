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
  constructor(props) {
    super(props);

    when(
      () => !props.user.authenticated,
      () => props.navigation.navigate('Auth'),
    );
  }

  async componentDidMount() {
    await this.props.nextShift.load();
  }

  handleCallOperator = () => {
    console.log('--> Will make a call');
  }

  handleLogout = () => {
    this.props.user.logout();
  }

  renderIdleState() {
    const { user, navigation } = this.props;

    const { loading, shift } = this.props.nextShift;

    const mapButton = loading ? (
      <TouchableOpacity
        disabled={true}
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
        onPress={() => navigation.navigate('Map')}
      >
        <View style={styles.mapContainer} pointerEvents="none">
          <MapMarker coordinate={{ latitude: shift.latStart, longitude: shift.longStart }} />
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={{ flex: 1 }}>
        <Text style={[styles.messageText, { marginTop: 50 }]}>Hi {user.name},</Text>
        {mapButton}
        {!loading && <Text style={[styles.messageText]}>Head to [{ shift.latStart }, { shift.longStart }]</Text>}
        {!loading && <Text style={styles.messageText}>by { new Date(shift.start).toString() }</Text>}
      </View>
    );
  }

  render() {
    const { navigation } = this.props;

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
            style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}
            onPress={this.handleLogout}
          >
            <View pointerEvents="none">
              <Icon
                name="input"
                color="#343434"
                containerStyle={styles.logoutButton}
                iconStyle={styles.logoutButtonIconStyle}
                onPress={() => navigation.navigate('DevSettings')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}
            onPress={this.handleCallOperator}
          >
            <View pointerEvents="none">
              <Icon
                name="call"
                color="#343434"
                containerStyle={styles.callButton}
                iconStyle={styles.callButtonIconStyle}
                onPress={() => navigation.navigate('DevSettings')}
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
    bottom: 100,
    left: 0,
    right: 0,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  callButton: {
    width: 75,
    height: 75,
    borderRadius: 75,
    marginLeft: 25,
    backgroundColor: '#fefefe',
    opacity: 0.75,
  },
  callButtonIconStyle: {
    marginTop: 16,
    fontSize: 42,
  },
  logoutButton: {
    width: 75,
    height: 75,
    borderRadius: 75,
    marginRight: 25,
    backgroundColor: '#fefefe',
    opacity: 0.75,
  },
  logoutButtonIconStyle: {
    marginTop: 16,
    fontSize: 42,
  },
});

export default HomeScreen;
