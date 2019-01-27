import React from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
// import SockJsClient from 'react-stomp';
import { GiftedChat } from 'react-native-gifted-chat';

const USER_DETAILS = 'user/user_details';

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
    this.userDetails = null;
    this.topic = '';
  }

  async componentDidMount() {
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
    this.userDetails = JSON.parse(await AsyncStorage.getItem(USER_DETAILS));
    this.topic = `/topic/public/${this.userDetails.id}`;
    // console.log('topic:');
    // console.log(this.userDetails);
  }

  onConnected = () => {
    // Subscribe to the Public Topic
    // console.log('connected.');
    this.stompClient.subscribe(this.topic, this.onReceivedMessage);

    // Tell your username to the server
    // this.stompClient.send("/app/chat.addUser",
    // const username = `${this.userDetails.firstName} ${this.userDetails.lastName}`;
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
    // console.log('onReceivedMessage:');
    // console.log(messages);
    // console.log('JSON parse:');
    const messageObject = JSON.parse(messages.body);
    // console.log(messageObject);
    // console.log(this.userDetails);
    if (messageObject.user._id !== this.userDetails.id) {
      this.setState(previousState => {
        return {
          messages: GiftedChat.append(previousState.messages, [(messageObject)]),
        };
      });
    }
  };

  onSend(messages = []) {
    // console.log('onSend:');
    // console.log(messages);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    const chatMessage = {
      _id: Date.now(),
      user: { _id: this.userDetails.id },
      sender: `${this.userDetails.firstName} ${this.userDetails.lastName}`,
      text: messages[0].text,
      type: 'CHAT',
    };
    // this.stompClient.send('/topic/public', JSON.stringify(messages[0]));
    // console.log('onSend:');
    // console.log(messages);
    this.stompClient.send(this.topic, {}, JSON.stringify(chatMessage));
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
