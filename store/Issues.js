import { observable, action } from "mobx";
import api from "../helpers/api";

export default class NextShiftStore {
  @observable issues = null;
  @observable fetchLoading = true;
  @observable fetchError = false;
  @observable insertLoading = false;
  @observable insertError = false;

  async fetch() {
    this.fetchLoading = true;

    try {
      const response = await api.get('/car-issues');
      console.log('---> ', response.data);
    } catch (e) {
      this.error = 'Error';
      console.log(e);
    } finally {
      this.fetchLoading = false;
    }
  }

  @action
  async addIssue(x, y, part, description) {
    this.insertLoading = true;

    try {
      const response = await api.put('/car-issues', {
        posX: x,
        posY: y,
        part: part,
        description: description,
      });

      console.log('response', response);
    } catch (e) {
      console.log(e);
    } finally {
      this.insertLoading = false;
    }
  }
}
