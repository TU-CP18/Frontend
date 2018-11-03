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
  
  @observable foobar = "ttest";

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
      const response = await api.post('/session', { username, password });

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
        runInAction(() => this.loginError = "User not found");
      }
    } catch (error) {
      console.log("error in User.login", error, error.message);

      let error = "Unknown error";
      
      if (!error.response) {
        error = "Network Error";
      }
      else if (error.response && error.response.status >= 400 && error.response.status < 500) {
        error = "User not found";
      }

      runInAction(() => this.loginError = error);
    }
  }

  @action async logout() {
    try {
      const userDetails = await AsyncStorage.removeItem(USER_DETAILS);
      this.authenticated = false;
      this.authToken = undefined;
      this.name = undefined;
    } catch (error) {
    }
  }
}