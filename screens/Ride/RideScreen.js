import React from 'react';
import {
  StyleSheet,
  View,
  Button,
} from 'react-native';

class RideScreen extends React.Component {
  static navigationOptions = {
    title: 'Manual Mode',
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Button
          onPress={() => navigation.navigate('Control')}
          title="Control"
          color="blue"
        />
        <Button
          onPress={() => navigation.navigate('RideCompletion')}
          title="End Ride"
          color="red"
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

export default RideScreen;
