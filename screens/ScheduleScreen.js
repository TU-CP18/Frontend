import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

export default class ScheduleScreen extends React.Component {

  static navigationOptions = {
    title: 'Schedule',
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
