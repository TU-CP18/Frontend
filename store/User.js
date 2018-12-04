import { AsyncStorage } from 'react-native';
import { observable, action, runInAction } from 'mobx';
import api from '../helpers/api';
import asyncSleep from '../helpers/asyncSleep';

const USER_DETAILS = 'user/user_details';

export default class User {
  @observable authenticated = false;

  @observable authToken;

  @observable name;

  @observable loginLoading = false;

  @observable loginError;

  @observable foobar = 'ttest';

  @action
  async init() {
    try {
      // await asyncSleep(1000);
      const userDetails = JSON.parse(await AsyncStorage.getItem(USER_DETAILS));

      if (userDetails.token) {
        this.authenticated = true;
        this.authToken = userDetails.token;
        this.name = userDetails.name;
      }
    } catch (error) {
    }
  }

  @action
  async login(username, password) {
    try {
      const response = await api.post('/authenticate', { username, password });

      if (response.status === 200) {
        const session = response.data;

        await AsyncStorage.setItem(USER_DETAILS, JSON.stringify(session));
        // see https://mobx.js.org/best/actions.html#async-await why runInAction have to be used
        runInAction(() => {
          this.authenticated = true;
          this.authToken = session.token;
          this.name = session.name;
        });
      } else {
        runInAction(() => {
          this.loginError = 'User not found';
        });
      }
    } catch (error) {
      if (error.status === 401) {
        runInAction(() => {
          this.loginError = 'User not found';
        });
      } else {
        console.log('error in User.login', error, error.message);

        let err = 'Unknown error';

        if (!err.response) {
          err = 'Network Error';
        } else if (err.response && err.response.status >= 400 && err.response.status < 500) {
          err = 'User not found';
        }

        runInAction(() => {
          this.loginError = err;
        });
      }
    }
  }

  @action async logout() {
    try {
      await AsyncStorage.removeItem(USER_DETAILS);
      this.authenticated = false;
      this.authToken = undefined;
      this.name = undefined;
    } catch (error) {
    }
  }
}
