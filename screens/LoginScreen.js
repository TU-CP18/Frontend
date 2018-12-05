import React from 'react';
import {
  StyleSheet,
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
import { observable, when } from 'mobx';
import { BackgroundImage } from '../components/BackgroundImage';

@inject('user')
@observer
class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  @observable username = '';
  @observable password = '';
  @observable keyboardOpen = false;

  constructor(props) {
    super(props);

    when(
      () => props.user.authenticated,
      () => props.navigation.navigate('Main'),
    );
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.keyboardOpen = true;
  };

  _keyboardDidHide = () => {
    this.keyboardOpen = false;
  };

  _onUsernameChange = (value) => {
    this.username = value;
  };

  _onPasswordChange = (value) => {
    this.password = value;
  };

  _onLoginPress = () => {
    this.props.user.login(this.username, this.password);
  };

  render() {
    return (
      <KeyboardAvoidingView style={[styles.container, this.keyboardOpen ? styles.containerKeyboardOpen : {}]} behavior="padding" enabled>
        <BackgroundImage />
        <View style={styles.formContainer}>
          <Input
            placeholder="Username"
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            inputStyle={styles.inputText}
            value={this.username}
            onChangeText={this._onUsernameChange}
            autoCapitalize="none"
            placeholderTextColor="rgba(255, 255, 255, 0.75)"
          />
          <Input
            placeholder="Password"
            secureTextEntry
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            inputStyle={styles.inputText}
            value={this.password}
            onChangeText={this._onPasswordChange}
            placeholderTextColor="rgba(255, 255, 255, 0.75)"
          />
          <Button
            title="Einloggen"
            onPress={this._onLoginPress}
            titleStyle={styles.buttonTitle}
            buttonStyle={styles.loginButton}
            loading={this.props.user.loginLoading}
          />
        </View>
        <Icon
          raised
          name="gear"
          type="font-awesome"
          color="#f50"
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
    padding: 25,
    backgroundColor: '#343434',
    alignItems: 'center',
    justifyContent: 'center',
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
    borderBottomColor: '#fefefe',
    borderBottomWidth: 2.0,
    opacity: 0.75,
  },
  input: {
    borderRadius: 12,
    borderWidth: 0,
    borderColor: 'transparent',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  inputText: {
    fontFamily: 'nemode',
    fontSize: 28,
    textAlign: 'center',
    color: '#fefefe',
  },
  inputError: {
    color: 'red',
    marginBottom: -12,
  },
  buttonTitle: {
    color: '#000000',
    fontFamily: 'nemode',
    fontSize: 28,
  },
  loginButton: {
    height: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    opacity: 0.75,
  },
  devSettingsIcon: {
    position: 'absolute',
    left: 10,
    bottom: 10,
  },
});

export default LoginScreen;
