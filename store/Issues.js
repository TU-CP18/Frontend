import { observable, action } from "mobx";
import api from "../helpers/api";

export default class NextShiftStore {
  @observable issues = [];

  @observable fetchLoading = true;
  @observable fetchError = false;

  @observable insertLoading = false;
  @observable insertError = false;

  async fetch() {
    if (!global.currentShift) {
      this.fetchError = true;
      return;
    }

    this.fetchLoading = true;
    const carId = global.currentShift.car.id;

    try {
      const response = await api.get(`/cars/${carId}/issues`);
      console.log('---> ', response.data);
      this.issues = response.data;
    } catch (e) {
      this.error = 'Error';
      console.log(e);
    } finally {
      this.fetchLoading = false;
    }
  }

  @action
  async addIssue(x, y, part, description) {
    if (!global.currentShift) {
      this.insertError = true;
      return;
    }

    this.insertLoading = true;
    const carId = global.currentShift.car.id;

    try {
      const response = await api.post(`/cars/${carId}/issues`, {
        posX: x,
        posY: y,
        part: part,
        description: description,
      });

      console.log('response', response);
      this.issues.push(response.data);
    } catch (e) {
      global.alertNotification.show(
        'Creation Error',
        'The issue could not be created',
      );
      console.log(e);
    } finally {
      this.insertLoading = false;
    }
  }
}
