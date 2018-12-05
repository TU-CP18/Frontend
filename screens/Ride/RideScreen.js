import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MapView } from 'expo';
import Button from '../../components/Button';
import { MaterialIcons } from '@expo/vector-icons';

class RideScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();

    this.state = {
      autopilotEnabled: false,
      nextStopShift: false,
      nextStopShiftReached: false,
    };
  }

  renderDriveModeButton = () => {
    const { navigation } = this.props;
    const { nextStopShiftReached, autopilotEnabled } = this.state;

    if (nextStopShiftReached) {
      // end of shift
      return (
        <Button
          title="Stop Ride"
          subtitle="And do a final check"
          onPress={() => navigation.navigate('RideCompletion')}
          wrapperStyle={styles.modeButtonWrapper}
          containerStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#000000',
          }}
          textStyle={{
            color: '#000000',
            fontSize: 22,
            alignSelf: 'center',
          }}
          subtitleStyle={[styles.modeButtonSubtitle, { color: '#000000' }]}
        />
      );
    }

    if (autopilotEnabled) {
      return (
        <Button
          title="STOP"
          subtitle="Autopilot"
          onPress={() => this.setState({ autopilotEnabled: false })}
          wrapperStyle={styles.modeButtonWrapper}
          containerStyle={{
            backgroundColor: '#D98B6F', // D94643
            borderColor: '#D94643',
          }}
          iconLeft="MaterialIcons/warning"
          iconStyle={{
            position: 'absolute',
            left: 15,
            top: '50%',
            transform: [{
              translateY: -10,
            }],
            color: '#ffffff',
            fontSize: 34,
          }}
          textStyle={{
            color: '#ffffff',
            fontSize: 22,
            alignSelf: 'center',
          }}
          subtitleStyle={[styles.modeButtonSubtitle, { color: '#ffffff' }]}
        />
      );
    }

    return (
      <Button
        title="START"
        subtitle="Autopilot"
        onPress={() => this.setState({ autopilotEnabled: true })}
        wrapperStyle={styles.modeButtonWrapper}
        containerStyle={{
          backgroundColor: '#00FF77',
          borderColor: '#41D904',
        }}
        textStyle={{
          color: '#ffffff',
          fontSize: 22,
          alignSelf: 'center',
        }}
        subtitleStyle={[styles.modeButtonSubtitle, { color: '#ffffff' }]}
      />
    );
  }

  render() {
    const { navigation } = this.props;
    const { nextStopShift, nextStopShiftReached } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapPreview}
          initialRegion={{
            latitude: 52.5191406,
            longitude: 13.4014149,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        />

        {!nextStopShift && (
          <View style={styles.warningContainer}>
            <MaterialIcons name="warning" size={36} style={styles.warningIcon} />
            <View>
              <Text style={styles.warningTitle}>Warning</Text>
              <Text style={styles.warningText}>A door is open</Text>
            </View>
          </View>
        )}

        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ nextStopShift: true, });
              if (nextStopShift) {
                this.setState({ nextStopShiftReached: true, });
              }
            }}
          >
            <View style={{
              padding: 10,
              backgroundColor: '#689FD9',
            }}>
              {!nextStopShift && (
                <Text style={{ color: 'white' }}>Next: Pickup Passenger</Text>
              )}
              {nextStopShift && !nextStopShiftReached && (
                <Text style={{ color: 'white' }}>Next: End Shift, drive to interchange point</Text>
              )}
              {nextStopShiftReached && (
                <Text style={{ color: 'white' }}>Interchange point reached, end of shift</Text>
              )}
            </View>
          </TouchableOpacity>

          {this.renderDriveModeButton()}

          <View style={styles.buttonGroup}>
            <Button
              title="Car"
              subtitle="Controll"
              onPress={() => navigation.navigate('Control')}
              iconLeft="Ionicons/md-settings"
              wrapperStyle={styles.buttonWrapper}
              containerStyle={styles.buttonContainer}
              iconStyle={styles.buttonIcon}
              textStyle={styles.buttonText}
              subtitleStyle={styles.buttonSubtitle}
            />

            <Button
              title="Report"
              subtitle="Incident"
              onPress={() => {}}
              iconLeft="MaterialIcons/report"
              wrapperStyle={styles.buttonWrapper}
              containerStyle={styles.buttonContainer}
              iconStyle={styles.buttonIcon}
              textStyle={styles.buttonText}
              subtitleStyle={styles.buttonSubtitle}
            />

            <Button
              title="Contact"
              subtitle="Fl. Manager"
              onPress={() => {}}
              iconLeft="FontAwesome/phone"
              wrapperStyle={styles.buttonWrapper}
              containerStyle={styles.buttonContainer}
              iconStyle={styles.buttonIcon}
              textStyle={styles.buttonText}
              subtitleStyle={styles.buttonSubtitle}
            />
          </View>
        </View>
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
    flex: 1,
  },
  content: {
  },
  buttonGroup: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    width: '31.5%',
  },
  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 50,
    backgroundColor: '#000000',
    flex: 1,
    justifyContent: 'flex-start',
  },
  buttonIcon: {
    marginRight: 5,
    color: '#ffffff',
  },
  buttonText: {
    color: '#ffffff',
  },
  buttonSubtitle: {
    color: '#ffffff',
  },
  warningContainer: {
    position: 'absolute',
    top: 40,
    left: '10%',
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    color: '#ffffff',
    marginRight: 10,
  },
  warningTitle: {
    fontSize: 19,
    color: '#ffffff',
  },
  warningText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modeButtonWrapper: {
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  modeButtonSubtitle: {
    fontSize: 18,
    alignSelf: 'center',
    marginTop: -5,
  },
});

export default RideScreen;
