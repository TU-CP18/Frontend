import { observable, action } from 'mobx';
import api from '../helpers/api';

export default class CurrentShiftStore {
  @observable car = null;
  @observable loading = null;
  @observable error = null;

  /**
   * Start shift take the shift saved in the NextShift store
   * and sets it as the current shift.
   * Additionally it will track current state of the shift
   * and receives the assigned car from the backend.
   *
   * @param {*} nextShift
   */
  @action
  async startShift(nextShift) {
    // track state
    try {
      const res = await api.post(`/shifts/${nextShift.shift.id}/track`, {
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
      const response = await api.get(`/shifts/${nextShift.id}`);
      console.log('response.data.car', response.data.car);
      this.car = response.data.car;
    } catch (e) {
      this.error = 'Error';
      console.log(e);
    } finally {
      this.loading = false;
    }
  }
}
