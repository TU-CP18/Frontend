import { observable } from "mobx";
import api from "../helpers/api";

const TWO_MINUTES = 2 * 60 * 1000;

export default class NextShiftStore {
  @observable shift = null;
  @observable loading = true;
  @observable error = '';

  lastLoaded = null;

  async load() {
    if (+new Date() - this.lastLoaded >= TWO_MINUTES) {
      this.loading = true;
      try {
        const response = await api.get('/shifts/next');
        this.shift = response.data;
      } catch (e) {
        this.error = 'Error';
        console.log(e);
      } finally {
        this.loading = false;
        this.lastLoaded = new Date();
      }
    }
  }
}