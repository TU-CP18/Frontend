import { observable, action } from 'mobx';
import { Location } from 'expo';
import { Alert } from 'react-native';
import api from '../helpers/api';
import lib from '../helpers/lib';

const TWO_MINUTES = 2 * 60 * 1000;

export default class NextShiftStore {
  @observable shift = null;

  @observable loading = true;

  @observable error = '';

  @observable openCarSucceeded = false;

  lastLoaded = null;

  @action
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

  @action
  async openCar() {
    // TODO: use in FinalConfirmationScreen to open the car
    const currentLocation = await lib.getLocation();
    this.openCarSucceeded = false;

    try {
      const res = await api.post(`/shifts/${this.shift.id}/authenticate`, { currentLocation });
      if (res.status === 200) {
        this.openCarSucceeded = true;
        // navigation.navigate('InteriorCheck');
      } else {
        Alert.alert('Authentication issue', 'You are not allowed to open the car. Contact your fleet manager.');
      }
    } catch (error) {
      if (error.status === 401) {
        console.log('Open car: authentication error', error);
      } else {
        console.log('error in Open car', error, error.message);
      }
      Alert.alert('Authentication issue', 'You are not allowed to open the car. Contact your fleet manager.');
    }
  }
}
