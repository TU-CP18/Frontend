import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { MapView } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import CarCheckItem from '../../components/CarCheckItem';
import Button from '../../components/Button';

class ExteriorCheckScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Exterior Check',
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
      issueModalVisible: false,
      issuePosition: {},
    };
  }

  toggleCheckbox = (id) => {
    const newValue = !this.state[id];
    this.setState({
      [id]: newValue,
    });
  }

  onPressOpenCar = () => {
    const { navigation } = this.props;

    if (!this.itemsChecked()) return;

    Alert.alert(
      // 'Alert Title',
      'Confirmation Request',
      'Confirm that you checked the exterior readiness of the '
      + 'car according to your besten Wissen and Gewissens',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => navigation.navigate('InteriorCheck') },
      ],
      { cancelable: true },
    );
  }

  itemsChecked = () => {
    const {
      rearChecked,
      driverChecked,
      frontChecked,
      codriverChecked,
    } = this.state;

    return rearChecked && driverChecked && frontChecked && codriverChecked;
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
    const {
      rearChecked,
      driverChecked,
      frontChecked,
      codriverChecked,
      issueModalVisible,
      issuePosition,
    } = this.state;

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

        <Modal
          animationType="slide"
          transparent={false}
          visible={issueModalVisible}
          onRequestClose={this.hideIssueModal}
        >
          <View style={{ padding: 20, }}>
            <View style={{ flexDirection: 'column', height: '100%', }}>
              <View style={{flex: 1}}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', }}>Record new issue</Text>
                <View style={{ height: 2, width: '20%', marginTop: 4,backgroundColor: '#cecece' }} />
                <TouchableWithoutFeedback
                  onPress={(event) => {
                    this.setState({
                      issuePosition: {
                        x: event.nativeEvent.locationX,
                        y: event.nativeEvent.locationY,
                      },
                    });
                  }}
                >
                  <View>
                    <Image
                      source={require('../../assets/images/car_rear.png')}
                      style={{
                        width: '100%',
                        height: 290,
                        resizeMode: 'contain',
                      }}
                    />
                    {issuePosition.x && (
                      <View
                        style={{
                          position: 'absolute',
                          width: 34,
                          borderRadius: 20,
                          borderWidth: 6,
                          borderColor: 'black',
                          height: 34,
                          left: issuePosition.x - 20,
                          top: issuePosition.y - 20,
                        }}
                      >
                        <View style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'red',
                          position: 'absolute',
                          top: 8,
                          left: 8,
                        }} />
                      </View>
                    )}
                  </View>
                </TouchableWithoutFeedback>
                <Text style={{ textAlign: 'center', width: '100%', marginBottom: 20}}>Rear Side</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#cecece',
                    padding: 10,
                    borderRadius: 4,
                    height: 38,
                  }}
                  underlineColorAndroid="transparent"
                  placeholder="Type in here the issue description ..."
                />

                {/* <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text>Hide Modal</Text>
                </TouchableHighlight> */}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                <Button
                  title="Cancel"
                  transparent
                  onPress={this.hideIssueModal}
                  wrapperStyle={{
                    marginRight: 20,
                  }}
                  containerStyle={{
                    paddingLeft: 20,
                    paddingRight: 20,
                  }}
                />
                <Button
                  title="Submit"
                  onPress={this.hideIssueModal}
                  wrapperStyle={{ flex: 1, }}
                  // containerStyle={{ flex: 1, }}
                />
              </View>
            </View>
          </View>
        </Modal>
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

export default ExteriorCheckScreen;
