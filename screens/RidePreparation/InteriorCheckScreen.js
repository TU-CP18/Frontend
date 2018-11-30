import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MapView } from 'expo';
import { CheckBox, Icon, Rating } from 'react-native-elements';

class InteriorCheckScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Interior Check',
      headerRight: (
        <Icon
          onPress={() => navigation.navigate('Contact')}
          name="headphones"
          type="feather"
          containerStyle={{
            paddingRight: 10,
          }}
        />
      ),
    };
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Map', {
            disableArrivalButton: true,
          })}
        >
          <MapView
            style={styles.mapPreview}
            initialRegion={{
              latitude: 52.5191406,
              longitude: 13.4014149,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          />
        </TouchableOpacity>
        <Text style={styles.guideText}>
          Check the interior of the car and track new issues if required.
        </Text>
        <CheckBox
          title="Seat Belts are intact"
          checked={false}
        />
        <Text>
        {'\u2022'}
        Passenger Seat: slightly torn open
        </Text>
        <Button
          onPress={() => {}}
          title="Add Issues"
          color="blue"
        />
        <Text style={styles.guideText}>
          Check the interior of the car and track new issues if required.
        </Text>
        <Rating
          fractions={1}
          ratingCount={10}
          imageSize={25}
          onFinishRating={(rating) => { console.log("FINISH RATTING", rating); }}
          onStartRating={(rating) => { console.log("START RATTING", rating); }}
        />

        <Button
          onPress={() => Alert.alert(
            // 'Alert Title',
            'Confirmation Request',
            'Confirm that you checked the operional readiness of the car '
            + 'accordingly and that you are prepared to drive manually if required.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Confirm', onPress: () => navigation.navigate('Ride') },
            ],
            { cancelable: true },
          )}
          title="Start Ride"
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
  mapPreview: {
    width: '100%',
    height: 80,
  },
  guideText: {
    padding: 20,
    fontSize: 16,
  },
  checkBoxLabel: {

  },
});

export default InteriorCheckScreen;
