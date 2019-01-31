
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { Entypo } from '@expo/vector-icons';
import Rating from '../../../components/Rating';
import Button from '../../../components/Button';

@inject('alert')
@observer
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

  constructor() {
    super();

    this.state = {
      rating: -1,
    };
  }

  onPressOpenCar = () => {
    const {
      navigation,
      alert,
    } = this.props;
    const {
      rating,
    } = this.state;

    if (rating === -1) {
      alert.show(
        'Rating missing',
        'Please rate the cleanliness of the exterior before you proceed',
      );
      return;
    }

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
    const {
      rating,
    } = this.state;

    return (
      <View style={s.container}>
        <View style={{ flex: 1, }}>
          <Text style={{ color: '#ffffff', marginBottom: 16, }}>
            Please rate the cleanliness of the car before opening th car.
          </Text>
          <Text style={{ color: '#ffffff' }}>
            If the car is quite dirty and needs a wash, provide a low rating.
          </Text>
          <Rating
            style={{ marginTop: 20,}}
            rating={rating}
            onRate={(rating) => {
              console.log("rating", rating)
              this.setState({
                rating,
              });
            }}
          />
        </View>

        <Button
          title="Open Car"
          containerStyle={{ marginBottom: 20, padding: 16, }}
          onPress={this.onPressOpenCar}
        />
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
