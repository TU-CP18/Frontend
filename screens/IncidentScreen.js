import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { Icon } from 'react-native-elements';
import Icons from '@expo/vector-icons';

@inject('user', 'chat')
@observer
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
    console.log('onPressContact');
    const { navigation } = this.props;
    navigation.navigate('Contact');
  };

  onPressCall = () => {
    console.log('call fleet manager');
  };

  Item = ({
    icon,
    iconStyle,
    label,
    separator = true,
  }) => {
    const Icon = Icons[icon.split('/')[0]];
    const iconName = icon.split('/')[1];

    return (
      <View style={[s.item, separator ? s.itemSeparator : {}]}>
        <View style={{ flex: 1 }}>
          <Icon
            name={iconName}
            style={[s.itemIcon, iconStyle]}
          />
        </View>
        <Text style={s.itemLabel}>
          {label}
        </Text>
      </View>
    );
  }

  MenuItem = ({ onPress, ...rest }) => (
    <TouchableOpacity
      style={s.menuItemTouchable}
      onPress={onPress}
    >
      <this.Item {...rest} />
    </TouchableOpacity>
  );


  render() {
    const { MenuItem } = this;

    return (
      <View style={s.container}>
        <View style={s.innerContainer}>
          <Text style={[s.messageText, { marginTop: 90 }]}>Emergency!</Text>
          <Text style={[s.messageText, { marginTop: 10 }]}>The car will stop.</Text>
          <Text style={[s.messageText, { marginTop: 10 }]}>
            Please contact your fleet manager via chat or phone call.
          </Text>
        </View>
        <View style={s.menu}>
          <MenuItem
            label="Contact Fleet Manager"
            icon="Entypo/chat"
            onPress={this.onPressContact}
            separator={false}
          />
          <MenuItem
            label="Call Fleet Manager"
            icon="FontAwesome/phone"
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
  bottomButtons: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#C2C2C2',
    paddingBottom: 15,
    marginBottom: 15,
  },
  itemIcon: {
    marginRight: 14,
    color: '#ffffff',
    fontSize: 26,
  },
  itemLabel: {
    flex: 7,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  menuItemTouchable: {
    alignItems: 'center',
  },
  menu: {
    marginBottom: 20,
    marginHorizontal: 20,
    marginTop: 30,
  },
});

export default IncidentScreen;
