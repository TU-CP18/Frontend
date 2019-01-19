import { observable } from 'mobx';
import moment from 'moment';
import api from '../helpers/api';

export default class ShiftSchedule {
  @observable shifts = null;

  @observable loading = true;

  @observable error = '';

  async load() {
    this.loading = true;

    try {
      const response = await api.get('/shifts/user/all');

      // convert shift data
      this.shifts = response.data.map(shift => {
        const start = moment(shift.start);
        const end = moment(shift.end);
        const diff = moment.utc(end.diff(start)).format('HH:mm');

        return {
          ...shift,
          startDay: start.format('DD'),
          startMonth: start.format('MMM'),
          fromTime: start.format('HH:mm'), // 'hh:mm a' for am/pm
          toTime: end.format('HH:mm'),
          durationHours: diff,
          street: shift.latStart ? 'Schönhauser Allee' : undefined,
          city: '10439 Berlin',
        };
      }).sort((a, b) => {
        return moment(a.start).isBefore(moment(b.end)) ? -1 : 1;
      });
    } catch (e) {
      this.error = 'Error';
      console.log(e);
    } finally {
      this.loading = false;
    }
  }
}
