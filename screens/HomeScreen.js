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

import { BackgroundImage } from '../components/BackgroundImage';
import MapMarker from '../components/MapMarker';

@inject('user')
@observer
class HomeScreen extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.user.authenticated) {
      this.props.navigation.navigate('Auth');
    }
  }

  handleCallOperator = () => {
    console.log('--> Will make a call');
  }

  handleLogout = () => {
    console.log('--> ', this.props.user);
    this.props.user.logout();
  }

  renderIdleState() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={[styles.messageText, { marginTop: 50 }]}>
          Hi {this.props.user.name},
        </Text>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('Map')}>
          <View style={styles.mapContainer} pointerEvents="none">
            <MapMarker coordinate={{ latitude: 52.523, longitude: 13.413492 }} />
          </View>
        </TouchableOpacity>
        <Text style={[styles.messageText]}>Head to Alexanderplatz</Text>
        <Text style={styles.messageText}>in 10 minutes</Text>
      </View>
    );
  }

  render() {
    this.props.user.authenticated;

    const inner = (() => {
      // TODO: Add assignment store from which we derive the current assignment
      return this.renderIdleState();
    })();

    return (
      <KeyboardAvoidingView style={[styles.container, this.keyboardOpen ? styles.containerKeyboardOpen : {}]} behavior="padding" enabled>
        <BackgroundImage />
        {inner}        
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }} onPress={this.handleLogout}>
            <View pointerEvents="none">
              <Icon
                name="input"
                color="#343434"
                containerStyle={styles.logoutButton}
                iconStyle={styles.logoutButtonIconStyle}
                onPress={() => this.props.navigation.navigate('DevSettings')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', }} onPress={this.handleCallOperator}>
            <View pointerEvents="none">
              <Icon
                name="call"
                color="#343434"
                containerStyle={styles.callButton}
                iconStyle={styles.callButtonIconStyle}
                onPress={() => this.props.navigation.navigate('DevSettings')}
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
