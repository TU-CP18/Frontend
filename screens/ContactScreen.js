import React from 'react';
import { StyleSheet, View } from 'react-native';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
// import SockJsClient from 'react-stomp';
import { GiftedChat } from 'react-native-gifted-chat';

class ContactScreen extends React.Component {
  static navigationOptions = {
    title: 'Contact',
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.stompClient = null;
  }

  componentDidMount() {
    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: 'Hello developer',
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //     },
    //   ],
    // })

    const socket = new SockJS('http://localhost:8080/websocket/chat/');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, this.onConnected, this.onError);
  }

  onConnected = () => {
    // Subscribe to the Public Topic
    console.log('connected.');
    this.stompClient.subscribe('/topic/public', this.onReceivedMessage);

    // Tell your username to the server
    // this.stompClient.send("/app/chat.addUser",
    const username = 'usertestname';
    // this.stompClient.send('/topic/public',
    //   {},
    //   JSON.stringify({ sender: username, type: 'JOIN' }),
    // );

    // connectingElement.classList.add('hidden');
  }

  onError = error => {
    console.log('Could not connect to WebSocket server. Please refresh this page to try again!', error);
    // connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    // connectingElement.style.color = 'red';
  }

  /**
   * When the server sends a message to this.
   */
  onReceivedMessage = messages => {
    console.log('onReceivedMessage:');
    console.log(messages);
    console.log('JSON parse:');
    console.log([JSON.parse(messages.body)]);
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, [(JSON.parse(messages.body))]),
      };
    });
  }

  onSend(messages = []) {
    console.log('onSend:');
    console.log(messages);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    const chatMessage = {
      _id: Date.now(),
      user: { _id: 1 },
      sender: 'native app',
      content: messages[0].text,
      type: 'CHAT',
    };
    // this.stompClient.send('/topic/public', JSON.stringify(messages[0]));
    // console.log('onSend:');
    // console.log(messages);
    this.stompClient.send('/topic/public', {}, JSON.stringify(chatMessage));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }

  // Helper functions
  // storeMessages(messages) {
  //
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ContactScreen;
