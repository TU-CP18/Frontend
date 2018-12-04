import { AsyncStorage } from 'react-native';
import {
  observable, action, runInAction, toJS,
} from 'mobx';

const DEV_SETTINGS = 'dev_settings';

export default class DevSettings {
  @observable settings = observable.map({
    fakeApi: false,
  });

  @action
  async init() {
    try {
      const settings = JSON.parse(await AsyncStorage.getItem(DEV_SETTINGS));
      runInAction(() => this.settings.replace(settings));
    } catch (error) {
      console.log('error in DevSettings.init', error);
    }
  }

  @action
  async set(key, value) {
    try {
      this.settings.set(key, value);
      await AsyncStorage.setItem(DEV_SETTINGS, JSON.stringify(toJS(this.settings)));
    } catch (error) {
    }
  }
}
