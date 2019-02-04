import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { observer, inject } from 'mobx-react';

@inject('alert')
@observer
class Alert extends React.Component {
  onItemPress = id => {
    const { alert } = this.props;
    alert.hide(id);
  }

  render() {
    const { alert } = this.props;
    const messages = alert.messages.slice();
    const addClass = messages[0] && !messages[0].header ? s.containerNoHeader : {};

    return (
      <View style={[s.container, addClass]}>
        {messages.map(msg => {
          return (
            <TouchableOpacity
              key={msg.id}
              style={s.itemWrapper}
              onPress={() => this.onItemPress(msg.id)}
            >
              <View style={[s.item, s[msg.type], addClass]}>
                <View style={s.content}>
                  <Text style={s.title}>
                    {msg.title}
                  </Text>
                  <Text style={s.subtitle}>
                    {msg.subtitle}
                  </Text>
                </View>
                <FontAwesome
                  size={32}
                  color="#ffffff"
                  name="close"
                  style={s.close}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    width: '100%',
    paddingHorizontal: 26,
  },
  containerNoHeader: {
    top: 30,
  },
  itemWrapper: {
    marginBottom: 14,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 4,
    flexDirection: 'row',
  },
  warning: {
    backgroundColor: 'rgba(96, 7, 7, 0.97)',
  },
  info: {
    backgroundColor: 'rgba(29, 125, 184, 1)',
  },
  success: {
    backgroundColor: 'rgba(96, 235, 77, 1)',
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 14,
  },
  close: {
    alignSelf: 'center',
    paddingLeft: 6,
  },
});

export default Alert;
