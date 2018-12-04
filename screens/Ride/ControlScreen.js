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
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            margin: 10,
            backgroundColor: '#cecece',
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#C1D9D3',
            alignItems: 'center',
          }}
        >
          <MaterialCommunityIcons
            name="fan"
            style={{
              fontSize: 28,
              marginRight: 14,
            }}
          />
          <MaterialCommunityIcons
            name="minus"
            style={{
              fontSize: 28,
              // marginRight: 14,
            }}
            onPress={() => {
              this.setState({
                fanLevel: Math.max(0, fanLevel - 1),
              });
            }}
          />
          <View
            style={{
              height: 20,
              flex: 1,
              // backgroundColor: '#000000',
              borderRadius: 10,
              // #2972D9
              // marginTop:
              borderWidth: 2,
              borderColor: '#000000',
              // position: 'relative',
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            <View
              style={{
                backgroundColor: '#000000',
                width: `${(fanLevel / MAX_FAN_LEVEL) * 100}%`,
                // width: '50%',
                height: '100%',
                borderRadius: 10,
              }}
            />

          </View>
          <MaterialCommunityIcons
            name="plus"
            onPress={() => {
              this.setState({
                fanLevel: Math.min(MAX_FAN_LEVEL, fanLevel + 1),
              });
            }}
            style={{
              fontSize: 28,
              // marginRight: 14,
            }}
          />
        </View>


        <TouchableOpacity onPress={() => this.setState({ lightOn: !lightOn })}>
          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              margin: 10,
              backgroundColor: '#cecece',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#C1D9D3',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons
              name={lightOn ? 'lightbulb-on' : 'lightbulb'}
              style={{
                fontSize: 28,
                marginRight: 14,
              }}
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
});

export default ControlScreen;
