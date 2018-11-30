import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { MapView } from 'expo';
import Button from '../../components/Button';

class RideScreen extends React.Component {
  static navigationOptions = {
    title: 'Manual Mode',
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapPreview}
          initialRegion={{
            latitude: 52.5191406,
            longitude: 13.4014149,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        />
        <View style={styles.content}>
          <Button
            onPress={() => navigation.navigate('Control')}
            title="Control"
          />
          <Button
            onPress={() => navigation.navigate('RideCompletion')}
            title="End Ride"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapPreview: {
    width: '100%',
    flex: 4,
  },
  content: {
    flex: 5,
  },
});

export default RideScreen;
