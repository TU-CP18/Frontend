import { AppState } from 'react-native';
import { Notifications } from 'expo';

const showNotification = (title, body) => {
  if (AppState.currentState === 'active') {
    // show alert
    global.alertNotification.show(
      title,
      body,
      'info',
    );
  } else {
    // show notification
    const localNotification = {
      title: title,
      body: body,
      android: {
        sound: true,
      },
      ios: {
        sound: true,
      },
    };
    Notifications.presentLocalNotificationAsync(localNotification);
  }
};

export default showNotification;
