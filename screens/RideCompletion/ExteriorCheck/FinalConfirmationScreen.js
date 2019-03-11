
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import { observer, inject, disposeOnUnmount } from 'mobx-react';
import { reaction } from 'mobx';
import { Entypo } from '@expo/vector-icons';
import Rating from '../../../components/Rating';
import Button from '../../../components/Button';

@inject('currentShift', 'alert')
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
          onPress={() => navigation.navigate('Contact')}
          name="chat"
          size={32}
          color="#ffffff"
          style={{ marginRight: 16, marginTop: 6 }}
        />
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      rating: -1,
    };
  }

  componentDidMount() {
    const { currentShift, navigation } = this.props;

    // react so insertLoading change in the issues store
    const openCarReaction = reaction(
      // react so insertLoading change in the issues store
      () => currentShift.openCarSucceeded,
      // reaction callback
      succeeded => succeeded && navigation.navigate('Main'),
    );

    // dispose reaction when unmounting this component
    disposeOnUnmount(this, openCarReaction);
  }

  onPressFinishShift = () => {
    const {
      alert,
      currentShift,
      navigation,
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
      'Confirmation Request',
      'Confirm that you checked the exterior of the car accordingly',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            currentShift.finishShift(rating);
            navigation.navigate('Main');
          },
        },
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
        <View style={{ flex: 1 }}>
          <Text style={s.guideText}>
            Please rate the cleanliness of the car before ending the shift.
          </Text>
          <Text style={s.guideText}>
            If the car is quite dirty and needs a wash, provide a low rating.
          </Text>
          <Rating
            style={{ marginTop: 20 }}
            rating={rating}
            onRate={userRating => {
              this.setState({
                rating: userRating,
              });
            }}
          />
        </View>

        <Button
          title="Finish Shift"
          containerStyle={{ marginBottom: 20, padding: 16 }}
          onPress={this.onPressFinishShift}
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
  guideText: {
    color: '#ffffff',
    fontSize: 17,
    marginBottom: 10,
  },
});

export default ExteriorCheckFinalConfirmationScreen;
