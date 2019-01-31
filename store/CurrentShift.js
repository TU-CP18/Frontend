import { observable, action } from 'mobx';
import { Alert } from 'react-native';
import api from '../helpers/api';
import lib from '../helpers/lib';

export default class CurrentShiftStore {
  @observable shiftId = null;

  @observable car = null;

  @observable loading = null;

  @observable error = null;

  @observable openCarLoading = false;

  @observable openCarSucceeded = false;

  @observable openCarError = false;

  /**
   * Start shift take the shift saved in the NextShift store
   * and sets it as the current shift.
   * Additionally it will track current state of the shift
   * and receives the assigned car from the backend.
   *
   * @param {*} nextShift
   */
  @action.bound
  async startShift(nextShift) {
    this.shiftId = nextShift.id;

    // track state
    try {
      const res = await api.post(`/shifts/${this.shiftId}/track`, {
        state: 'confirmedArrival',
      });
      if (res.status !== 200) {
        console.log('error when confirming arrival', res);
      }
    } catch (error) {
      console.log('error when confirming arrival', error);
    }

    // nextShift currently does not hold the car entity
    // receive the complete shift object
    this.loading = true;

    try {
      const response = await api.get(`/shifts/${this.shiftId}`);
      console.log('response.data.car', response.data.car);
      this.car = response.data.car;
    } catch (e) {
      this.error = 'Error';
      console.log(e);
    } finally {
      this.loading = false;
    }
  }

  @action.bound
  async openCar() {
    const currentLocation = await lib.getLocation();
    this.openCarSucceeded = false;
    this.openCarLoading = true;
    this.openCarError = false;

    try {
      const res = await api.post(`/shifts/${this.shiftId}/authorize`, { currentLocation });
      if (res.status === 200) {
        this.openCarSucceeded = true;
      } else {
        this.openCarError = true;
        Alert.alert('Authorization issue', 'You are not allowed to open the car. Contact your fleet manager.');
      }
    } catch (error) {
      this.openCarError = true;
      if (error.status === 403) {
        console.log('Open car: authorization error', error);
      } else {
        console.log('error in Open car', error, error.message);
      }
      Alert.alert('Authorization issue', 'You are not allowed to open the car. Contact your fleet manager.');
    } finally {
      this.openCarLoading = false;
      this.openCarSucceeded = true;
    }
  }
}
