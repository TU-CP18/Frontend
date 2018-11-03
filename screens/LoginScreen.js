import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {
  Input,
  Button,
  Icon,
} from 'react-native-elements';
import { observer, inject } from 'mobx-react/native';
import { observable } from 'mobx';

@inject("user")
@observer
export default class LoginScreen extends React.Component {

  @observable username = '';
  @observable password = '';
  @observable keyboardOpen = false;

  static navigationOptions = {
    header: null,
  };

  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.user.authenticated) {
      this.props.navigation.navigate('Main');
    }
  }

  _keyboardDidShow = () => {
    this.keyboardOpen = true;
  }
  
  _keyboardDidHide = () => {
    this.keyboardOpen = false;
  }

  _onUsernameChange = (value) => {
    this.username = value;
  }

  _onPasswordChange = (value) => {
    this.password = value;
  }

  _onLoginPress = () => {
    this.props.user.login(this.username, this.password);
  }

  render() {
    this.props.user.authenticated;

    return (
      <KeyboardAvoidingView style={[styles.container, this.keyboardOpen ? styles.containerKeyboardOpen : {}]} behavior="padding" enabled>
        <Image
          style={styles.backgroundImage}
          source={require('../assets/images/background_van.jpg')}
        />
        <View style={styles.formContainer}>
          <Input
            placeholder="Username"
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            leftIcon={{ type: 'font-awesome', name: 'user' }}
            value={this.username}
            onChangeText={this._onUsernameChange}
            errorStyle={styles.inputError}
            errorMessage={this.props.user.loginError}
          />
          <Input
            placeholder="Password"
            secureTextEntry={true}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            leftIcon={{ type: 'font-awesome', name: 'user' }}
            value={this.password}
            onChangeText={this._onPasswordChange}
            errorStyle={styles.inputError}
            errorMessage={this.props.user.loginError}
          />
          <Button
            title="Einloggen"
            onPress={this._onLoginPress.bind(this)}
            titleStyle={styles.buttonTitle}
            buttonStyle={styles.loginButton}
            loading={this.props.user.loginLoading}
          />
        </View>
        <Icon
          raised
          name='gear'
          type='font-awesome'
          color='#f50'
          containerStyle={styles.devSettingsIcon}
          onPress={() => this.props.navigation.navigate('DevSettings')}
        />
      </KeyboardAvoidingView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  containerKeyboardOpen: {
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  formContainer: {
    width: '100%',
    alignItems: 'stretch',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  input: {
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  inputError: {
    color: 'red',
    marginBottom: -12,
  },
  buttonTitle: {
    color: '#000000',
  },
  loginButton: {
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  devSettingsIcon: {
    position: 'absolute',
    left: 10,
    bottom: 10,
  },
});