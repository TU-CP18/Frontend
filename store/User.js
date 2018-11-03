import { AsyncStorage } from 'react-native';
import { observable, action, runinAction, runInAction } from 'mobx';

const USER_DETAILS = 'user/user_details';

export default class User {
  @observable authenticated = false;
  @observable authToken;
  @observable name;

  @observable loginLoading = false;
  @observable loginError = false;
  
  @observable foobar = "ttest";

  @action
  async init() {
    try {
      const userDetails = JSON.parse(await AsyncStorage.getItem(USER_DETAILS));

      if (userDetails.token) {
        console.log("AUTHENTICATED")
        this.authenticated = true;
        this.authToken = userDetails.token;
        this.name = userDetails.name;
      }
    } catch (error) {
    }
  }

  @action
  login(username, password) {
    console.log("HALLo");
    // try {

    //   await AsyncStorage.setItem(USER_DETAILS, JSON.stringify({ token: '123', name: 'John Snow' }));
    // }
    // catch (error) {

    // }

    // see https://mobx.js.org/best/actions.html#async-await why runInAction have to be used
    // runInAction(() => {
      this.foobar = 'danach';
      this.authenticated = true;
      this.authToken = '123';
      this.name = 'John Snow';
      console.log("Authenticated :)", this.authenticated)
    // });

    // login could look like this ...

    // try {
    //   const response = api.post('/session', { username, password });

    //   if (response.status === 200) {
    //     const session = response.data.data;

    //     const userDetails = await AsyncStorage.setItem(USER_DETAILS, JSON.stringify(session));
    //     this.authenticated = true;
    //     this.authToken = session.token;
    //     this.name = session.name;
    //   } else {
    //     yield put(loginFailed("Benutzer wurde nicht gefunden"));
    //   }
    // } catch (error) {
    //   if (error.message === 'Network Error') {
    //     this.error = "Some Nice Network Error Message";
    //     return;
    //   }
    //   else if (error.response.status >= 400 && error.response.status < 500) {
    //     this.error = "Some Could not be found Error Message";
    //     return;
    //   }
    //   this.error = "Unknow error";
    // }
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