import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  NativeModules,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { observer, inject } from 'mobx-react';

const { UIManager } = NativeModules;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

@inject('alert')
@observer
class Alert extends React.Component {
  // componentWillUpdate() {
  //   LayoutAnimation.easeInEaseOut();
  // }

  onItemPress = id => {
    const { alert } = this.props;
    alert.hide(id);
  }

  render() {
    const { alert } = this.props;

    return (
      <View style={s.container}>
        {alert.messages && alert.messages.slice().map(msg => {
          return (
            <TouchableOpacity
              key={msg.id}
              style={s.itemWrapper}
              onPress={() => this.onItemPress(msg.id)}
            >
              <View style={s.item}>
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
  itemWrapper: {
    marginBottom: 14,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 4,
    // backgroundColor: 'rgba(0, 0, 0, 0.92)',
    backgroundColor: 'rgba(96, 7, 7, 0.97)',
    // 231, 85, 85
    flexDirection: 'row',
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
