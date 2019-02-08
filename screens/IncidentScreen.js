import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MenuItem from '../components/MenuItem';

class IncidentScreen extends React.Component {
  static navigationOptions = {
    title: 'Incident',
    headerStyle: {
      backgroundColor: '#000000',
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
    console.log('call fleet manager');
  };

  render() {
    return (
      <View style={s.container}>
        <View style={s.innerContainer}>
          <Text style={[s.messageText, { marginTop: 90 }]}>
            Emergency!
          </Text>
          <Text style={[s.messageText, { marginTop: 10 }]}>
            The car will stop.
          </Text>
          <Text style={[s.messageText, { marginTop: 10 }]}>
            Please contact your fleet manager via chat or phone call.
          </Text>
        </View>
        <View style={s.menu}>
          <MenuItem
            label="Contact Fleet Manager"
            icon="Entypo/chat"
            onPress={this.onPressContact}
            />
          <MenuItem
            label="Call Fleet Manager"
            icon="FontAwesome/phone"
            onPress={this.onPressCall}
            separator={false}
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
    marginBottom: 40,
    marginHorizontal: 20,
    marginTop: 30,
  },
});

export default IncidentScreen;
