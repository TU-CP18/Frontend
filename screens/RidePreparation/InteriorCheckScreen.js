import React from 'react';
import {
  StyleSheet,
  View,
  Button,
} from 'react-native';

class InteriorCheckScreen extends React.Component {
  static navigationOptions = {
    title: 'Interior Check',
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Button
          onPress={() => navigation.navigate('Ride')}
          title="Ride"
          color="blue"
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

export default InteriorCheckScreen;
