import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TextInput,
} from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { ListItem } from 'react-native-elements';
import { observer, inject } from 'mobx-react/native';

@inject('devSettings')
@observer
class DevSettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Dev Settings',
  };

  static keyExtractor = item => item.label;

  renderItem = ({ item }) => {
    if (item.type === 'checkbox') {
      return (
        <ListItem
          title={item.label}
          subtitle={item.subtitle && item.subtitle}
          leftIcon={{
            name: item.leftIcon,
            type: item.leftIconType,
          }}
          rightIcon={item.rightIcon && {
            name: item.rightIcon,
            type: item.rightIconType,
          }}
          bottomDivider
          onPress={item.onPress}
        />
      );
    }

    if (item.type === 'textinput') {
      return (
        <ListItem
          title={item.label}
          subtitle={(
            <View>
              <TextInput
                style={s.textInput}
                underlineColorAndroid="transparent"
                placeholder="Production API Host"
                value={item.value}
                onChangeText={item.onChange}
                placeholderTextColor="rgba(33, 41, 54, 0.8)"
              />
              <Text>
                Example: "http://192.168.0.1:8080", /api and /websocket will be automatically suffixed.
                This entry will be ignored if "Production API" is disabled. Default is "http://webapp.isecp.de"
              </Text>
            </View>
          )}
          leftIcon={{
            name: item.leftIcon,
            type: item.leftIconType,
          }}
          bottomDivider
        />
      );
    }

    return null;
  }

  render() {
    const { devSettings } = this.props;

    const settingsList = [
      {
        type: 'checkbox',
        label: 'Fake API',
        subtitle: 'Server call will ve faked, have a look at "helper/fakeApi.js"',
        leftIcon: 'aircraft',
        leftIconType: 'entypo',
        rightIcon: devSettings.settings.get('fakeApi') ? 'check-square' : 'square',
        rightIconType: 'feather',
        onPress: () => {
          devSettings.set('fakeApi', !devSettings.settings.get('fakeApi'));
        },
      },
      {
        type: 'checkbox',
        label: 'Production API',
        leftIcon: 'upload-to-cloud',
        leftIconType: 'entypo',
        rightIcon: devSettings.settings.get('productionApi') ? 'check-square' : 'square',
        rightIconType: 'feather',
        onPress: () => {
          devSettings.set('productionApi', !devSettings.settings.get('productionApi'));
        },
      },
      {
        type: 'textinput',
        label: 'Production API Host',
        leftIcon: 'home',
        leftIconType: 'ionicons',
        value: devSettings.settings.get('productionApiHost'),
        onChange: newHost => {
          devSettings.set('productionApiHost', newHost);
        },
      },
      {
        type: 'checkbox',
        label: 'Simulate Navigation',
        subtitle: 'Simulate Location in Turn-by-turn navigation"',
        leftIcon: 'aircraft',
        leftIconType: 'entypo',
        rightIcon: devSettings.settings.get('fakeNavigation') ? 'check-square' : 'square',
        rightIconType: 'feather',
        onPress: () => {
          devSettings.set('fakeNavigation', !devSettings.settings.get('fakeNavigation'));
        },
      },
      {
        type: 'checkbox',
        label: 'Demo Awareness Check',
        subtitle: 'Shortens the awareness check countdown to 15 seconds"',
        leftIcon: 'aircraft',
        leftIconType: 'entypo',
        rightIcon: devSettings.settings.get('demoAwarenessCheck') ? 'check-square' : 'square',
        rightIconType: 'feather',
        onPress: () => {
          devSettings.set('demoAwarenessCheck', !devSettings.settings.get('demoAwarenessCheck'));
        },
      },
    ];

    return (
      <View style={s.container}>
        <FlatList
          keyExtractor={DevSettingsScreen.keyExtractor}
          data={settingsList}
          renderItem={this.renderItem}
        />
        <Text style={s.expoConfigTitle}>
          Expo Config:
        </Text>
        <ExpoConfigView />
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
  },
  expoConfigTitle: {
    padding: 10,
    paddingLeft: 16,
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    height: 38,
    marginTop: 4,
    marginBottom: 4,
  },
});

export default DevSettingsScreen;
