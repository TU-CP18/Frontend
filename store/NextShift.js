import { LayoutAnimation } from 'react-native';
import { observable, action } from 'mobx';
import { Location } from 'expo';
import api from '../helpers/api';
import sleep from '../helpers/asyncSleep';

export default class NextShiftStore {
  @observable shift = null;

  @observable loading = true;

  @observable error = '';

  @observable polling = false;

  @action.bound
  async load(explicit = true, ignoreCalled = false) {
    this.loading = explicit;

    // counter known bug
    // somehow HomeScreen is mounted twice which results in two calls of this
    // action at the same time. Return when loading is already true
    if (!ignoreCalled && this.called) return;
    this.called = true;

    // sleep 1000, this is nice for the demo
    // aditionally we don't is pauses the polling for new shifts
    await sleep(1500);

    try {
      const response = await api.get('/shifts/user/next');

      const { locationServicesEnabled } = await Location.getProviderStatusAsync();
      if (locationServicesEnabled) {
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
      if (this.polling) {
        this.load(false, true);
      }
    } finally {
      this.loading = false;
    }
  }
}
