import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Icon } from 'react-native-elements';

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

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.messageText, { marginTop: 10 }]}>This is the emergency screen.</Text>
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={console.log('chat action.')}
          >
            <View pointerEvents="none">
              <Icon
                name="comments"
                type="font-awesome"
                color="#fefefe"
                containerStyle={styles.settingsButton}
                iconStyle={styles.settingsButtonIconStyle}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={console.log('call action.')}
          >
            <View pointerEvents="none">
              <Icon
                name="call"
                color="#fefefe"
                containerStyle={styles.callButton}
                iconStyle={styles.callButtonIconStyle}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f00',
  },
  messageText: {
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
});

export default IncidentScreen;
