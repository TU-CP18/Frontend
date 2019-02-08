import { AsyncStorage } from 'react-native';
import { observable, action } from 'mobx';
import api from '../helpers/api';
import asyncSleep from '../helpers/asyncSleep';

const USER_DETAILS = 'user/user_details';

export default class User {
  @observable authenticated = false;

  @observable authToken;

  @observable name;

  @observable id;

  @observable loginLoading = false;

  @observable loginError;

  @observable foobar = 'ttest';

  @action.bound
  async init() {
    try {
      await asyncSleep(1000);
      const userDetails = JSON.parse(await AsyncStorage.getItem(USER_DETAILS));
      if (userDetails && userDetails.id_token) {
        this.authToken = userDetails.id_token;
        this.id = userDetails.id;
        this.name = `${userDetails.firstName || ''} ${userDetails.lastName || ''}`;
        this.authenticated = true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  @action.bound
  async login(username, password) {
    try {
      const tokenResponse = await api.post('/authenticate', { username, password });

      if (tokenResponse.status === 200) {
        await AsyncStorage.setItem(
          USER_DETAILS,
          JSON.stringify({ ...tokenResponse.data }),
        );

        this.authToken = tokenResponse.data.id_token;

        const accountResponse = await api.get('/account');
        await AsyncStorage.setItem(
          USER_DETAILS,
          JSON.stringify({ ...tokenResponse.data, ...accountResponse.data }),
        );

        this.id = accountResponse.data.id;
        this.name = `${accountResponse.data.lastName || ''} ${accountResponse.data.firstName || ''}`;

        // set authenticated to true at the end as it works as a trigger
        // for other functions which require this.id etc. to already be set
        // an example is ChatStore.load()
        this.authenticated = true;
        return true;
      }

      this.loginError = 'User not found';
      return false;
    } catch (error) {
      if (error.status === 401) {
        this.loginError = 'User not found';
      } else {
        console.log('error in User.login', error, error.message);

        let err = 'Unknown error';

        if (!err.response) {
          err = 'Network Error';
        } else if (err.response && err.response.status >= 400 && err.response.status < 500) {
          err = 'User not found';
        }

        this.loginError = err;
      }
    }

    return false;
  }

  @action.bound
  async logout() {
    try {
      await AsyncStorage.removeItem(USER_DETAILS);
      this.authenticated = false;
      this.authToken = undefined;
    } catch (error) {
      console.log('---> Failed to logout', error);
      console.log(error);
    }
  }
}
