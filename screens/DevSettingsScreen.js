import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
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
});

export default DevSettingsScreen;
