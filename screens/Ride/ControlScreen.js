import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

class ControlScreen extends React.Component {
  static navigationOptions = {
    title: 'Groundcontrol',
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

export default ControlScreen;
