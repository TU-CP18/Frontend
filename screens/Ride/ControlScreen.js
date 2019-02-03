import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import logger from '../../helpers/logger';

const MAX_FAN_LEVEL = 10;
const INITAL_FAN_LEVEL = 3;
const MIN_TEMPERATURE_LEVEL = 16
const MAX_TEMPERATURE_LEVEL = 28;
const INITAL_TEMP_LEVEL = 22;

const FAN_INTENSITY = 'FAN_INTENSITY';
const TEMPERATURE = 'TEMPERATURE';
const LIGHT = 'LIGHT';

class ControlScreen extends React.Component {
  static navigationOptions = () => {
    return {
      title: 'Groundcontrol',
      headerStyle: {
        backgroundColor: '#000000',
        elevation: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: '#ffffff',
    };
  };

  constructor() {
    super();

    this.state = {
      fanLevel: INITAL_FAN_LEVEL,
      tempLevel: INITAL_TEMP_LEVEL,
      lightOn: false,
    };
  }

  setFanIntensity = newFanLevel => {
    this.setState({
      fanLevel: newFanLevel,
    });
    logger.slog(logger.CONTROL_SET, {
      control: FAN_INTENSITY,
      value: newFanLevel,
    });
  }

  setTemperatur = newTempLevel => {
    this.setState({
      tempLevel: newTempLevel,
    });
    logger.slog(logger.CONTROL_SET, {
      control: TEMPERATURE,
      value: newTempLevel,
    });
  }

  toggleLight = () => {
    const { lightOn } = this.state;
    this.setState({ lightOn: !lightOn });
    logger.slog(logger.CONTROL_SET, {
      control: LIGHT,
      value: (lightOn ? 1 : 0),
    });
  }

  Item = ({ icon, children }) => (
    <View style={s.configItem}>
      <MaterialCommunityIcons
        name={icon}
        style={s.configIcon}
        color="#ffffff"
      />
      {children}
    </View>
  );

  IncrementItem = ({
    icon,
    children,
    onDecrement,
    onIncrement,
  }) => (
    <this.Item icon={icon}>
      <MaterialCommunityIcons
        name="minus"
        size={28}
        onPress={onDecrement}
        color="#ffffff"
      />
      {children}
      <MaterialCommunityIcons
        name="plus"
        onPress={onIncrement}
        size={28}
        color="#ffffff"
      />
    </this.Item>
  );

  render() {
    const { fanLevel, tempLevel, lightOn } = this.state;

    return (
      <View style={s.container}>
        <this.IncrementItem
          icon="fan"
          onDecrement={() => { this.setFanIntensity(Math.max(0, fanLevel - 1)); }}
          onIncrement={() => { this.setFanIntensity(Math.min(MAX_FAN_LEVEL, fanLevel + 1)); }}
        >
          <View style={s.meter}>
            <View
              style={[
                s.meterIndicator,
                { width: `${(fanLevel / MAX_FAN_LEVEL) * 100}%` },
              ]}
            />
          </View>
        </this.IncrementItem>

        <this.IncrementItem
          icon="waves"
          onDecrement={() => this.setTemperatur(Math.max(MIN_TEMPERATURE_LEVEL, tempLevel - 0.5))}
          onIncrement={() => this.setTemperatur(Math.min(MAX_TEMPERATURE_LEVEL, tempLevel + 0.5))}
        >
          <View style={s.temperatureWrapper}>
            <Text style={s.temperatureValue}>{tempLevel.toFixed(1)}</Text>
            <MaterialCommunityIcons
              name="temperature-celsius"
              style={s.configIcon}
              color="#ffffff"
            />
          </View>
        </this.IncrementItem>

        <TouchableOpacity onPress={this.toggleLight}>
          <this.Item icon={lightOn ? 'lightbulb-on' : 'lightbulb'}>
            {lightOn && (
              <Text style={s.text}>Switch Lights Off</Text>
            )}
            {!lightOn && (
              <Text style={s.text}>Switch Lights On</Text>
            )}
          </this.Item>
        </TouchableOpacity>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  configItem: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ffffff',
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
    borderColor: '#ffffff',
    marginLeft: 5,
    marginRight: 5,
  },
  temperatureWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperatureValue: {
    color: '#ffffff',
    fontSize: 24,
  },
  meterIndicator: {
    backgroundColor: '#ffffff',
    height: '100%',
    borderRadius: 10,
  },
  text: {
    color: '#ffffff',
  },
});

export default ControlScreen;
