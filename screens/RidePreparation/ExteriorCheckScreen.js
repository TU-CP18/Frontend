import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MapView } from 'expo';
import { CheckBox, Icon } from 'react-native-elements';

class ExteriorCheckScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Exterior Check',
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
        <ScrollView>
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
            Follow the check list and track new issues if required
          </Text>
          <CheckBox
            title="Check Rear Side"
            checked={false}
          />
          <CheckBox
            title="Check Driver Side"
            checked={false}
          />
          <CheckBox
            title="Check Driver Side Tires"
            checked={false}
          />
          <CheckBox
            title="Check Front Side"
            checked={false}
          />
          <CheckBox
            title={(
              <View>
                <Text style={styles.checkBoxLabel}>
                  Check Co-Driver Side
                </Text>
                <Text style={{ paddingLeft: 2, }}>
                  {'\u2022'}
                  Co-Driver door: Big Dent
                </Text>
              </View>
            )}
            checked={false}
          />
          <CheckBox
            title="Check Co-Driver Side Tires"
            checked={false}
          />

          <Button
            onPress={() => {}}
            title="Add issues"
            color="blue"
          />

          <Button
            onPress={() => Alert.alert(
              // 'Alert Title',
              'Confirmation Request',
              'Confirm that you checked the exterior readiness of the '
              + 'car according to your besten Wissen and Gewissens',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => navigation.navigate('InteriorCheck') },
              ],
              { cancelable: true },
            )}
            title="Open car"
            color="green"
          />
        </ScrollView>
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

export default ExteriorCheckScreen;
