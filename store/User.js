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
      console.log(userDetails);
      console.log(userDetails.id_token);
      if (userDetails.id_token) {
        this.authenticated = true;
        this.authToken = userDetails.id_token;
      }
    } catch (error) {
      console.log(error);
    }
  }

  @action
  async login(username, password) {
    try {
      const response = await api.post('/authenticate', { username, password });
      if (response.status === 200) {
        const { data } = response;

        await AsyncStorage.setItem(USER_DETAILS, JSON.stringify(data));
        // see https://mobx.js.org/best/actions.html#async-await why runInAction have to be used
        runInAction(() => {
          this.authenticated = true;
          this.authToken = data.id_token;
        });
      } else {
        runInAction(() => {
          this.loginError = 'User not found';
        });
      }
    } catch (error) {
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

  @action
  async logout() {
    try {
      await AsyncStorage.removeItem(USER_DETAILS);
      this.authenticated = false;
      this.authToken = undefined;
    } catch (error) {
      console.log(error);
    }
  }
}
