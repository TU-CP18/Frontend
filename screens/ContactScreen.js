import React from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { inject, observer } from 'mobx-react';

@inject('user', 'chat')
@observer
class ContactScreen extends React.Component {
  static navigationOptions = {
    title: 'Contact',
    headerStyle: {
      backgroundColor: '#000000',
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: '#ffffff',
  };

  render() {
    const { chat, user } = this.props;

    return (
      <GiftedChat
        messages={chat.messages.slice()}
        onSend={messages => chat.sendMessage(messages)}
        user={{
          _id: user.id,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ContactScreen;
