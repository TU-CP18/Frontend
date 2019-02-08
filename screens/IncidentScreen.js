import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Constants } from 'expo';
import { Entypo, FontAwesome } from '@expo/vector-icons';

class IncidentScreen extends React.Component {
  static navigationOptions = {
    title: '',
    headerStyle: {
      backgroundColor: '#f00',
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: '#ffffff',
  };

  onPressContact = () => {
    const { navigation } = this.props;
    navigation.navigate('Contact');
  };

  onPressCall = () => {
    if (Constants.isDevice) {
      Linking.openURL('tel:+123456789');
      return;
    }

    Alert.alert(
      'Call Fleet Manager',
      'Link:"tel:+1234567" call intents do not work on Simulators',
    );
  };

  Button = ({ onPress, IconComponent, iconName }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={s.iconWrapper}>
        <IconComponent
          name={iconName}
          style={s.icon}
        />
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={s.container}>
        <View style={s.innerContainer}>
          <Text style={[s.messageText, { marginTop: 90 }]}>
            EMERGENCY
          </Text>
          <Text style={[s.messageText, { marginTop: 20 }]}>
            The car will stop.
          </Text>
          <Text style={[s.messageText, { marginTop: 10 }]}>
            Please contact your fleet manager via chat or phone call.
          </Text>
        </View>

        <View style={s.menu}>
          <this.Button
            IconComponent={Entypo}
            iconName="chat"
            onPress={this.onPressContact}
          />
          <this.Button
            IconComponent={FontAwesome}
            iconName="phone"
            onPress={this.onPressCall}
          />
        </View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f00',
  },
  innerContainer: {
    flex: 1,
  },
  messageText: {
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: 'nemode',
    fontSize: 32,
    fontWeight: '600',
    color: '#fefefe',
    textAlign: 'center',
  },
  menu: {
    marginBottom: 70,
    marginHorizontal: 20,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 60,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 50,
    color: '#f00',
  },
});

export default IncidentScreen;
