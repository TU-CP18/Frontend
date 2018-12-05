import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MAX_FAN_LEVEL = 10;

class ControlScreen extends React.Component {
  static navigationOptions = {
    title: 'Groundcontrol',
  };

  constructor() {
    super();

    this.state = {
      fanLevel: 3,
      lightOn: false,
    };
  }

  render() {
    const { fanLevel, lightOn } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.configItem}>
          <MaterialCommunityIcons
            name="fan"
            style={styles.configIcon}
          />
          <MaterialCommunityIcons
            name="minus"
            size={28}
            onPress={() => {
              this.setState({
                fanLevel: Math.max(0, fanLevel - 1),
              });
            }}
          />
          <View style={styles.meter}>
            <View
              style={[
                styles.meterIndicator,
                { width: `${(fanLevel / MAX_FAN_LEVEL) * 100}%` },
              ]}
            />
          </View>
          <MaterialCommunityIcons
            name="plus"
            onPress={() => {
              this.setState({
                fanLevel: Math.min(MAX_FAN_LEVEL, fanLevel + 1),
              });
            }}
            size={28}
          />
        </View>

        <TouchableOpacity onPress={() => this.setState({ lightOn: !lightOn })}>
          <View
            style={styles.configItem}
          >
            <MaterialCommunityIcons
              name={lightOn ? 'lightbulb-on' : 'lightbulb'}
              style={styles.configIcon}
            />
            {lightOn && (
              <Text>Switch Light Off</Text>
            )}
            {!lightOn && (
              <Text>Switch Light On</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  configItem: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    backgroundColor: '#cecece',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#C1D9D3',
    alignItems: 'center',
  },
  configIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  meter: {
    height: 20,
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    marginLeft: 5,
    marginRight: 5,
  },
  meterIndicator: {
    backgroundColor: '#000000',
    height: '100%',
    borderRadius: 10,
  },
});

export default ControlScreen;
