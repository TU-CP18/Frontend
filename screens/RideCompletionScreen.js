import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CarCheckItem from '../components/CarCheckItem';
import Button from '../components/Button';
import IssueModal from '../components/IssueModal';

class RideCompletionScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Ride Completion Check',
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
      rearChecked: false,
      driverChecked: false,
      frontChecked: false,
      codriverChecked: false,
      interiorChecked: false,
      issueModalVisible: false,
    };
  }

  toggleCheckbox = id => {
    const newValue = !this.state[id];
    this.setState({
      [id]: newValue,
    });
  }

  onPressCloseCar = () => {
    const { navigation } = this.props;

    if (!this.itemsChecked()) return;

    navigation.navigate('Main');
  }

  itemsChecked = () => {
    const {
      rearChecked,
      driverChecked,
      frontChecked,
      codriverChecked,
      interiorChecked,
    } = this.state;

    return rearChecked && driverChecked && frontChecked && codriverChecked && interiorChecked;
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
    const {
      rearChecked,
      driverChecked,
      frontChecked,
      codriverChecked,
      issueModalVisible,
      interiorChecked,
    } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.guideText}>
            To end your shift, make a check final check for issues.
          </Text>

          <CarCheckItem
            title="Check Interior"
            checked={interiorChecked}
            onPressCheck={() => this.toggleCheckbox('interiorChecked')}
            onPressAddIssue={this.showIssueModal}
            issues={[]}
          />

          <CarCheckItem
            title="Check Rear Side"
            checked={rearChecked}
            onPressCheck={() => this.toggleCheckbox('rearChecked')}
            onPressAddIssue={this.showIssueModal}
            issues={[
              'Driver Door: Big Dent',
              'Driver Window: Scratch',
            ]}
          />

          <CarCheckItem
            title="Check Driver Side"
            checked={driverChecked}
            onPressCheck={() => this.toggleCheckbox('driverChecked')}
            onPressAddIssue={this.showIssueModal}
            issues={[]}
          />

          <CarCheckItem
            title="Check Front Side"
            checked={frontChecked}
            onPressCheck={() => this.toggleCheckbox('frontChecked')}
            onPressAddIssue={this.showIssueModal}
            issues={[]}
          />

          <CarCheckItem
            title="Check Co-Driver Side"
            checked={codriverChecked}
            onPressCheck={() => this.toggleCheckbox('codriverChecked')}
            onPressAddIssue={this.showIssueModal}
            issues={['Co-Driver door: Big Dent']}
          />

          <Button
            onPress={this.onPressCloseCar}
            title="Close Car"
            subtitle="And end the Shift"
            iconLeft="EvilIcons/lock"
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

export default RideCompletionScreen;
