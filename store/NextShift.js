import { LayoutAnimation } from 'react-native';
import { observable, action } from 'mobx';
import { Location } from 'expo';
import api from '../helpers/api';
import sleep from '../helpers/asyncSleep';

export default class NextShiftStore {
  @observable shift = null;

  @observable loading = true;

  @observable error = '';

  @observable requestConter = 0;

  ignoreShiftId = -1;

  @action.bound
  async startPolling() {
    if (global.devSettings.settings.get('fakeApi')) {
      this.load();
      return;
    }

    // counter known bug
    // somehow HomeScreen is mounted twice which results in two calls of this
    // action at the same time. Return when requestConter reaches 2
    this.requestConter += 1;
    if (this.requestConter > 1) return;

    this.pollingInterval = setInterval(() => {
      this.load(false);
    }, 5000);

    await sleep(1000);
    await this.load(true);
  }

  async stopPolling() {
    this.requestConter -= 1;
    if (this.pollingInterval && this.requestConter === 0) {
      clearInterval(this.pollingInterval);
      this.requestConter = 0;
    }
  }

  @action.bound
  async load(explicit = true) {
    this.loading = explicit;

    try {
      const response = await api.get('/shifts/user/next');

      if (this.shift
        && response.data.id === this.shift.id
        && response.data.start === this.shift.start
      ) return;

      if (response.data.id === this.ignoreShiftId) {
        return;
      }

      if (global.devSettings.settings.get('fakeApi')) {
        LayoutAnimation.easeInEaseOut();
        this.shift = response.data;
        return;
      }

      const { locationServicesEnabled } = await Location.getProviderStatusAsync();
      if (locationServicesEnabled) {
        // reverseGeocodeAsync leads to an app crash when the lat long values are not
        // correct, watch out to use correct values or hardcode an example:
        // const geocode = [{
        //   name: 'Schönhauser Allee 38',
        //   postalCode: '10439',
        //   city: 'Berlin',
        // }];
        const geocode = await Location.reverseGeocodeAsync({
          latitude: response.data.latStart,
          longitude: response.data.longStart,
        });
        const [address] = geocode;

        LayoutAnimation.easeInEaseOut();
        this.shift = {
          ...response.data,
          address,
        };

        if (!explicit) {
          global.alertNotification.show(
            'New Shift',
            'You received a new assignment!',
            'info',
            false,
          );
        }
      }
    } catch (e) {
      this.error = 'Error';
      console.log(e);
    } finally {
      this.loading = false;
    }
  }
}
