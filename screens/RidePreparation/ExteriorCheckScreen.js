import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { FontAwesome } from '@expo/vector-icons';
import CarCheckItem from '../../components/CarCheckItem';
import Button from '../../components/Button';
import IssueModal from '../../components/IssueModal';
import MapMarker from '../../components/MapMarker';
import lib from '../../helpers/lib';
import api from '../../helpers/api';

@inject('issues', 'nextShift')
@observer
class ExteriorCheckScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      // title: 'Exterior Check',
      // headerMode: 'none',
      // headerRight: (
      //   <FontAwesome
      //     onPress={() => navigation.navigate('Contact')}
      //     name="phone"
      //     size={28}
      //     style={{
      //       paddingRight: 12,
      //     }}
      //   />
      // ),
    };
  };

  constructor() {
    super();

    this.state = {
      rearChecked: false,
      driverChecked: false,
      frontChecked: false,
      codriverChecked: false,
      issueModalVisible: false,
    };
  }

  componentDidMount() {
    // const { issues } = this.props;
    // issues.fetch();
  }

  toggleCheckbox = id => {
    const newValue = !this.state[id];
    this.setState({
      [id]: newValue,
    });
  };

  onPressOpenCar = () => {
    if (!this.itemsChecked()) return;

    Alert.alert(
      // 'Alert Title',
      'Confirmation Request',
      'Confirm that you checked the exterior operational readiness of the '
      + 'car accordingly',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: this.onConfirmOpenCar },
      ],
      { cancelable: true },
    );
  };

  onConfirmOpenCar = async () => {
    const { navigation, nextShift } = this.props;
    const currentLocation = await lib.getLocation();

    try {
      const res = await api.post(`/shifts/${nextShift.shift.id}/authenticate`, { currentLocation });
      if (res.status === 200) {
        navigation.navigate('InteriorCheck');
      } else {
        Alert.alert('Authentication issue', 'You are not allowed to open the car. Contact your fleet manager.');
      }
    } catch (error) {
      if (error.status === 401) {
        console.log('Open car: authentication error', error);
      } else {
        console.log('error in Open car', error, error.message);
      }
      Alert.alert('Authentication issue', 'You are not allowed to open the car. Contact your fleet manager.');
    }
  };

  itemsChecked = () => {
    const {
      rearChecked,
      driverChecked,
      frontChecked,
      codriverChecked,
    } = this.state;

    return rearChecked && driverChecked && frontChecked && codriverChecked;
  };

  showIssueModal = () => {
    this.setState({
      issueModalVisible: true,
    });
  };

  hideIssueModal = () => {
    this.setState({
      issueModalVisible: false,
    });
  };

  render() {
    const {
      navigation,
      issues,
      nextShift,
    } = this.props;

    const {
      rearChecked,
      driverChecked,
      frontChecked,
      codriverChecked,
      issueModalVisible,
    } = this.state;

    // if (issues.fetchLoading) {
    //   return (
    //     <View style={styles.loadingContainer}>
    //       <StatusBar
    //         // backgroundColor="#000000"
    //         barStyle="light-content"
    //       />
    //       <ActivityIndicator
    //         size="large"
    //         color="#ffffff"
    //       />
    //     </View>
    //   );
    // }

    return (
      <View style={styles.container}>
        <ScrollView>
          <TouchableOpacity
            onPress={() => navigation.navigate('Map', {
              latitude: nextShift.shift.latStart,
              longitude: nextShift.shift.longStart,
              showDirections: false,
              initialFocus: 'gps',
            })}
          >
            <MapMarker
              coordinate={{
                latitude: nextShift.shift.latStart,
                longitude: nextShift.shift.longStart,
              }}
              style={styles.mapPreview}
              zoomEnabled={false}
              scrollEnabled={false}
            />
          </TouchableOpacity>

          <Text style={styles.guideText}>
            Follow the check list and track new issues if required
          </Text>

          <CarCheckItem
            title="Check Rear Side"
            checked={rearChecked}
            onPressCheck={() => this.toggleCheckbox('rearChecked')}
            onPressAddIssue={this.showIssueModal}
            issues={[]}
          />

          <CarCheckItem
            title="Check Driver Side"
            checked={driverChecked}
            onPressCheck={() => this.toggleCheckbox('driverChecked')}
            onPressAddIssue={this.showIssueModal}
            issues={['Driver Door: Big Dent']}
          />

          <CarCheckItem
            title="Check Front Side"
            checked={frontChecked}
            onPressCheck={() => this.toggleCheckbox('frontChecked')}
            onPressAddIssue={this.showIssueModal}
            issues={[
              'Bonnet Right: Vertical Scratch',
              'Bonnet Bottom Left: Small Dent',
            ]}
          />

          <CarCheckItem
            title="Check Co-Driver Side"
            checked={codriverChecked}
            onPressCheck={() => this.toggleCheckbox('codriverChecked')}
            onPressAddIssue={this.showIssueModal}
            issues={[]}
          />

          <Button
            onPress={this.onPressOpenCar}
            title="Open car"
            iconLeft="EvilIcons/unlock"
            disabled={!(this.itemsChecked())}
            wrapperStyle={{
              margin: 10,
            }}
            containerStyle={[
              styles.buttonContainer,
              this.itemsChecked() ? styles.buttonEnabled : styles.buttonDisabled,
            ]}
            textStyle={[
              this.itemsChecked() ? styles.buttonTextEnabled : styles.buttonTextDisabled,
            ]}
            iconStyle={[
              this.itemsChecked() ? styles.buttonIconEnabled : styles.buttonIconDisabled,
            ]}
          />
        </ScrollView>

        <IssueModal
          visible={issueModalVisible}
          onHide={this.hideIssueModal}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    paddingLeft: 10,
    fontSize: 16,
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

export default ExteriorCheckScreen;
