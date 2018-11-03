import React from 'react';
import {
  StyleSheet,
  View,
  Button,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { MonoText } from '../components/StyledText';

@inject('user')
@observer
export default class HomeScreen extends React.Component {

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.user.authenticated) {
      this.props.navigation.navigate('Auth');
    }
  }

  render() {
    this.props.user.authenticated; 

    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.props.user.logout()}
          title="Logout"
          color="red"
        />
        <Button
          onPress={() => this.props.navigation.navigate('Schedule')}
          title="Schedule"
          color="green"
        />
        <Button
          onPress={() => this.props.navigation.navigate('Contact')}
          title="Contact"
          color="blue"
        />
        <Button
          onPress={() => this.props.navigation.navigate('Departure')}
          title="Departure"
          color="yellow"
        />
        <Button
          onPress={() => this.props.navigation.navigate('Map')}
          title="Map"
          color="purple"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
