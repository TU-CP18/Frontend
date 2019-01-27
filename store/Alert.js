import { observable, action } from 'mobx';

import {
  LayoutAnimation,
} from 'react-native';

/**
 * The Alert store provides an API to display short
 * alert at any place in the app.
 * The Component /components/Alert makes use of it.
 */
export default class Alert {
  @observable messages = [
    // { title: 'Marker missing', subtitle: 'Please select an area in the image' },
    // { title: 'Description missing', subtitle: 'Please provide a description for the issue' },
  ];

  @action
  show(title, subtitle) {
    const id = Date.now();

    LayoutAnimation.easeInEaseOut();

    this.messages.push({
      id,
      title,
      subtitle,
    });

    setTimeout(() => {
      for (let i = 0; i < this.messages.length; i += 1) {
        LayoutAnimation.easeInEaseOut();
        if (this.messages[i].id === id) {
          this.messages.splice(i, 1);
          break;
        }
      }
    }, 5000);
  }

  @action
  hide(id) {
    for (let i = 0; i < this.messages.length; i += 1) {
      LayoutAnimation.easeInEaseOut();
      if (this.messages[i].id === id) {
        this.messages.splice(i, 1);
        break;
      }
    }
  }
}
