import { observable, action } from 'mobx';
import { Location } from 'expo';
import api from '../helpers/api';

const TWO_MINUTES = 2 * 60 * 1000;

export default class NextShiftStore {
  @observable shift = null;

  @observable loading = true;

  @observable error = '';

  lastLoaded = null;

  @action.bound
  async load() {
    if (new Date() - this.lastLoaded >= TWO_MINUTES) {
      this.loading = true;
      try {
        const response = await api.get('/shifts/user/next');
        this.shift = response.data;
      } catch (e) {
        this.error = 'Error';
        console.log(e);
      } finally {
        const { locationServicesEnabled } = await Location.getProviderStatusAsync();
        if (locationServicesEnabled && this.shift) {
          const geocode = await Location.reverseGeocodeAsync({
            latitude: this.shift.latStart,
            longitude: this.shift.longStart,
          });
          const [address] = geocode;
          this.shift.address = address;
        }
        this.loading = false;
        this.lastLoaded = new Date();
      }
    }
  }
}
