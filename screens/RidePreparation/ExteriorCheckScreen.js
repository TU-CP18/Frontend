import React from 'react';
import { CheckBox, Icon } from 'react-native-elements';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
} from 'react-native';

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
        <Button
          onPress={() => navigation.navigate('Map', {
            disableArrivalButton: true,
          })}
          title="Map"
          color="blue"
        />
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  guideText: {
    padding: 20,
    fontSize: 16,
  },
  checkBoxLabel: {

  },
});

export default ExteriorCheckScreen;
