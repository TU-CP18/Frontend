import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import ContactScreen from './ContactScreen';

class DepartureScreen extends React.Component {
  static navigationOptions = {
    title: 'Departure',
  };

  render() {
    return (
      <View style={styles.container} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default DepartureScreen;
