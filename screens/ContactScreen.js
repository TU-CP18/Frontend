import React from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { inject, observer } from 'mobx-react';

@inject('chat')
@observer
class ContactScreen extends React.Component {
  static navigationOptions = {
    title: 'Contact',
  };

  render() {
    const { chat } = this.props;

    return (
      <GiftedChat
        messages={chat.messages.slice()}
        onSend={messages => chat.sendMessage(messages)}
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
