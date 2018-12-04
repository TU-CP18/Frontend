import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  KeyboardAvoidingView,
  Image,
  Text,
  TouchableHighlight, 
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { MonoText } from '../components/StyledText';
import { BackgroundImage } from '../components/BackgroundImage';

@inject('user')
@observer
class HomeScreen extends React.Component {

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.user.authenticated) {
      this.props.navigation.navigate('Auth');
    }
  }

  renderIdleState() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={[styles.messageText, { marginTop: 50 }]}>Hi {this.props.user.name},</Text>
        <TouchableHighlight style={{ alignItems: 'center', justifyContent: 'center', }} onPress={() => null}>
          <View style={styles.mapButton} />
        </TouchableHighlight>
        <Text style={[styles.messageText]}>Head to --Location--</Text>
        <Text style={styles.messageText}>in --x-- minutes</Text>
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
          <TouchableHighlight style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', }} onPress={() => null}>
            <View style={styles.callButton} />
          </TouchableHighlight>
          <TouchableHighlight style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', }} onPress={() => null}>
            <View style={styles.logoutButton} />
          </TouchableHighlight>
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
    fontSize: 32,
    fontWeight: '600',
    color: '#fefefe',
    textAlign: "center",
  },
  mapButton: {
    marginTop: 25,
    marginBottom: 25,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fefefe',
    opacity: 0.75,
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
  logoutButton: {
    width: 75,
    height: 75,
    borderRadius: 75,
    marginRight: 25,
    backgroundColor: '#fefefe',
    opacity: 0.75,
  },
});

export default HomeScreen;
