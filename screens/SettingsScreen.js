import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { observer, inject, disposeOnUnmount } from 'mobx-react';
import { reaction } from 'mobx';
import Button from '../components/Button';

@inject('user')
@observer
class SettingsScreen extends React.Component {

  @disposeOnUnmount
  logoutReaction = reaction(
    () => !this.props.user.authenticated,
    loggedOut => loggedOut && this.props.navigation.navigate('Auth'),
  )

  static navigationOptions = () => {
    return {
      title: 'Settings',
      headerStyle: {
        backgroundColor: '#000000',
        elevation: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: '#ffffff',
    };
  };

  handleLogout = () => {
    const { user } = this.props;
    user.logout();
  };

  render() {
    return (
      <View style={s.container}>
        <View style={s.content}>
          {/*  */}
        </View>
        <Button
          title="Logout"
          onPress={this.handleLogout}
          containerStyle={{ marginBottom: 20, padding: 16, backgroundColor: '#DB2323' }}
        />
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    padding: 20,
  },
  content: {
    flex: 1,
  },
});

export default SettingsScreen;
