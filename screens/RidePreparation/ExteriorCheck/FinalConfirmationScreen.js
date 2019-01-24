
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';

class ExteriorCheckFinalConfirmationScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Exterior Check',
      headerStyle: {
        backgroundColor: '#000000',
        elevation: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: '#ffffff',
      headerRight: (
        <Entypo
          onPress={() => alert('This is a button!')}
          name="chat"
          size={32}
          color="#ffffff"
          style={{ marginRight: 16, marginTop: 6 }}
        />
      ),
    };
  };

  onPressOpenCar = () => {
    const { navigation } = this.props;

    if (!this.itemsChecked()) return;

    Alert.alert(
      // 'Alert Title',
      'Confirmation Request',
      'Confirm that you checked the exterior operational readiness of the '
      + 'car accordingly',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => navigation.navigate('InteriorCheck') },
      ],
      { cancelable: true },
    );
  }

  render() {
    return (
      <View style={s.container}>
        <Text style={{ color: '#ffffff' }}>Final Confirmation</Text>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default ExteriorCheckFinalConfirmationScreen;
