import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MapView } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import CarCheckItem from '../../components/CarCheckItem';
import Rating from '../../components/Rating';
import Button from '../../components/Button';
import IssueModal from '../../components/IssueModal';

class InteriorCheckScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Interior Check',
      headerRight: (
        <FontAwesome
          onPress={() => navigation.navigate('Contact')}
          name="phone"
          size={28}
          style={{
            paddingRight: 12,
          }}
        />
      ),
    };
  };

  constructor() {
    super();

    this.state = {
      interiorChecked: false,
      cleanlinessRating: -1,
      issueModalVisible: false,
    };
  }

  onPressStartRide = () => {
    if (!this.checklistDone()) return;

    const { navigation } = this.props;

    Alert.alert(
      'Confirmation Request',
      'Confirm that you checked the operional readiness of the car '
      + 'accordingly and that you are prepared to drive manually if required.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => navigation.navigate('Ride') },
      ],
      { cancelable: true },
    );
  }

  checklistDone = () => {
    const { interiorChecked, cleanlinessRating } = this.state;
    return interiorChecked && cleanlinessRating > 0;
  }

  showIssueModal = () => {
    this.setState({
      issueModalVisible: true,
    });
  }

  hideIssueModal = () => {
    this.setState({
      issueModalVisible: false,
    });
  }

  render() {
    const { navigation } = this.props;
    const { interiorChecked, cleanlinessRating, issueModalVisible } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.content}>
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

          <CarCheckItem
            title="Interior is operational"
            checked={interiorChecked}
            onPressCheck={() => this.setState({ interiorChecked: !interiorChecked })}
            onPressAddIssue={this.showIssueModal}
            issues={[
              'Passenger Seat: slightly torn open',
              'OMFG, there is blood everywhere!!',
            ]}
          />

          <Text style={[styles.guideText, styles.guideTextCleanliness]}>
            Please rate the cleanliness of the car
          </Text>
          <Rating
            rating={cleanlinessRating}
            onRate={(rating) => this.setState({ cleanlinessRating: rating })}
            style={styles.rating}
          />
        </View>

        <Button
          onPress={this.onPressStartRide}
          title="Start Ride"
          iconLeft="MaterialCommunityIcons/car-connected"
          disabled={!this.checklistDone()}
          wrapperStyle={{
            margin: 10,
          }}
          containerStyle={[
            styles.buttonContainer,
            this.checklistDone() ? styles.buttonEnabled : styles.buttonDisabled,
          ]}
          textStyle={[
            this.checklistDone() ? styles.buttonTextEnabled : styles.buttonTextDisabled,
          ]}
          iconStyle={[
            this.checklistDone() ? styles.buttonIconEnabled : styles.buttonIconDisabled,
          ]}
        />

        <IssueModal
          visible={issueModalVisible}
          onHide={this.hideIssueModal}
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
  content: {
    flex: 1,
  },
  mapPreview: {
    width: '100%',
    height: 80,
  },
  guideText: {
    padding: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
  guideTextCleanliness: {
    paddingBottom: 4,
  },
  rating: {
    paddingLeft: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  buttonEnabled: {
    backgroundColor: '#1CFF95',
    borderColor: '#cecece',
  },
  buttonDisabled: {
    backgroundColor: '#cecece',
  },
  buttonTextEnabled: {
    color: '#ffffff',
  },
  buttonIconEnabled: {
    color: '#ffffff',
  },
});

export default InteriorCheckScreen;
