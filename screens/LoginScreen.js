import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { observer, inject } from 'mobx-react/native';

@inject("user")
@observer
export default class LoginScreen extends React.Component {

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.user.authenticated) {
      this.props.navigation.navigate('Main');
    }
  }

  render() {
    this.props.user.authenticated;

    return (
      <View style={styles.container}>
        <Text>Login Screen</Text>
      
        <Button
          // onPress={user.login} does not work! because of the context
          onPress={() => this.props.user.login()}
          title="Login"
          color="#841584"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
