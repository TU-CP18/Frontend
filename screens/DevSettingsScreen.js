import React from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { ListItem } from 'react-native-elements';
import { observer, inject } from 'mobx-react/native';
 
@inject('devSettings')
@observer
export default class DevSettingsScreen extends React.Component {

  static navigationOptions = {
    title: 'Dev Settings',
  }

  static keyExtractor = (item, index) => item.label;

  renderItem({ item }) { 
    if (item.type === 'checkbox') {
      return (
        <ListItem
          title={item.label}
          subtitle={item.subtitle && item.subtitle}
          leftIcon={{
            name: item.leftIcon,
            type: item.leftIconType
          }}
          rightIcon={item.rightIcon && {
            name: item.rightIcon,
            type: item.rightIconType
          }}
          bottomDivider
          onPress={item.onPress}
        />
      );
    }
    else if (item.type === 'textinput') {

    }
  }

  render() {
    const settingsList = [
      // {
      //   type: 'checkbox',
      //   label: 'Development Mode',
      //   leftIcon: 'code',
      //   leftIconType: 'entypo',
      //   rightIcon: settings.get('devMode') ? 'check-square' : 'square',
      //   rightIconType: 'feather',
      //   onPress: () => {
      //     setSetting('devMode', !settings.get('devMode'));
      //   },
      // },
      {
        type: 'checkbox',
        label: 'Fake API',
        subtitle: 'Server call will ve faked, have a look at "helper/fakeApi.js"',
        leftIcon: 'aircraft',
        leftIconType: 'entypo',
        rightIcon: this.props.devSettings.settings.get('fakeApi') ? 'check-square' : 'square',
        rightIconType: 'feather',
        onPress: () => {
          this.props.devSettings.set('fakeApi', !this.props.devSettings.settings.get('fakeApi'));
        },
      },
    ]

    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={DevSettingsScreen.keyExtractor}
          data={settingsList}
          renderItem={this.renderItem.bind(this)}
          style={styles.optionList}
        />
        <Text style={{ padding: 10, paddingLeft: 16, fontSize: 16 }}>Expo Config:</Text>
        <ExpoConfigView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
  },
});