import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

export default class DepartureScreen extends React.Component {

  static navigationOptions = {
    title: 'Departure',
  };

  render() {
    return (
      <View style={styles.container}>
        
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
