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

  constructor() {
    this.persistCleanliness = CurrentShiftStore.persistCleanliness;
  }

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
  async openCar(rating) {
    const currentLocation = await lib.getLocation();
    this.openCarSucceeded = false;
    this.openCarLoading = true;
    this.openCarError = false;

    // persist rating of the cleanlines
    await this.persistCleanliness(rating);

    // authorize the opening of the car
    try {
      const res = await api.post(`/shifts/${this.shiftId}/authorize`, { currentLocation });
      if (res.status === 200) {
        this.openCarSucceeded = true;
      } else {
        this.openCarError = true;
        Alert.alert('Authentication issue', 'You are not allowed to open the car. Contact your fleet manager.');
      }
    } catch (error) {
      this.openCarError = true;
      if (error.status === 401) {
        console.log('Open car: authentication error', error);
      } else {
        console.log('error in Open car', error, error.message);
      }
      Alert.alert('Authentication issue', 'You are not allowed to open the car. Contact your fleet manager.');
    } finally {
      this.openCarLoading = false;

      // TODO: temporary, remove when authorize endpoint is available
      this.openCarSucceeded = true;
    }
  }

  @action.bound
  async finishRidePreparation(rating) {
    // persist rating of the cleanlines
    await this.persistCleanliness(rating);
  }

  /**
   * Persist the rating of the clealiness by the user.
   * Part can be either 'interior' or 'exterior'.
   * Event be be either 'preRide' or 'postRide'.
   * Rating is a number.
   *
   * @param {part, event, rating} rating
   */
  static async persistCleanliness(rating) {
    try {
      const carId = global.currentShift.car.id;
      await api.post(`/cars/${carId}/cleanliness`, {
        part: rating.part,
        event: rating.event,
        rating: rating.score,
      });
    } catch (e) {
      // do noghinb, when the cleanliness could not be saved this is
      // unfortunate but negligible
      // TODO: log event for the FM or throw an error
      console.log(e);
    }
  }
}
