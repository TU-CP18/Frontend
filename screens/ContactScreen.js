import React from 'react';
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

  componentDidMount() {
    const { chat } = this.props;
    chat.chatScreenOpen = true;
  }

  componentWillUnmount() {
    const { chat } = this.props;
    chat.chatScreenOpen = false;
  }

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

export default ContactScreen;
