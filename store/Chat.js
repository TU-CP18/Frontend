import { observable, action } from 'mobx';
import api from '../helpers/api';
import { GiftedChat } from 'react-native-gifted-chat';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { AsyncStorage } from 'react-native';

const USER_DETAILS = 'user/user_details';

export default class ChatStore {
  @observable messages = [];
  @observable loading = true;
  @observable error = '';

  @action
  async load() {
    const socket = new SockJS('http://localhost:8080/websocket/chat/');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, this.onConnected, this.onError);
    this.userDetails = JSON.parse(await AsyncStorage.getItem(USER_DETAILS));
    this.topic = `/topic/public/${this.userDetails.id}`;

    // load history
    /*
    this.loading = true;
    try {
      const response = await api.get(`/chat-messages/history/${this.userDetails.id}`);
      // append history to gifted chat
      for (const key in response.data) {
        const message = response.data[key];
        console.log(message);
        // first we assume the message was sent (by the app user)
        const giftedMessage = {
          _id: message.createdAt,
          user: {},
          text: message.text,
          createdAt: message.createdAt,
        };
        // if message was received, add data about the sender
        if (message.sender.id !== this.userDetails.id) {
          giftedMessage.user = {
            _id: message.sender.id,
            avatar: message.sender.imageUrl,
          };
        }
        this.messages = GiftedChat.append(this.messages, giftedMessage);
      }
    } catch (e) {
      this.error = 'Error';
      console.error(e);
    } finally {
      this.loading = false;
    }
    */
  }

  onConnected = () => {
    this.stompClient.subscribe(this.topic, this.onReceivedMessage);
  };

  onError = error => {
    console.log('Could not connect to WebSocket server. Please refresh this page to try again!', error);
  };

  @action
  sendMessage(messages = []) {
    this.messages = GiftedChat.append(this.messages, messages);

    const chatMessage = {
      _id: Date.now(),
      user: { _id: this.userDetails.id },
      sender: `${this.userDetails.firstName} ${this.userDetails.lastName}`,
      text: messages[0].text,
      type: 'CHAT',
    };
    this.stompClient.send(this.topic, {}, JSON.stringify(chatMessage));
  }

  /**
   * When the server sends a message to this.
   */
  onReceivedMessage = messages => {
    const messageObject = JSON.parse(messages.body);
    if (messageObject.user._id !== this.userDetails.id) {
      this.messages = GiftedChat.append(this.messages, messageObject);
    }
  };
}
