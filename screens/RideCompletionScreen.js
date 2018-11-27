import React from 'react';
import {
  StyleSheet,
  View,
  Button,
} from 'react-native';

class RideCompletionScreen extends React.Component {
  static navigationOptions = {
    title: 'Ride Completion',
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Button
          onPress={() => navigation.navigate('Main')}
          title="To Main menu"
          color="green"
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

export default RideCompletionScreen;
