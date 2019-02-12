import { observable } from 'mobx';
import { Location } from 'expo';
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
      const { locationServicesEnabled } = await Location.getProviderStatusAsync();

      // convert shift data
      let futureShifts = response.data.filter(shift => {
        // only keep shifts which are in the future or have not been ended
        return moment(shift.end).isAfter(moment());
      });
      futureShifts = futureShifts.map(async shift => {
        const start = moment(shift.start);
        const end = moment(shift.end);
        const diff = moment.utc(end.diff(start)).format('HH:mm');
        let address = null;
        // if (locationServicesEnabled && shift.latStart && shift.longStart) {
        //   [address] = await Location.reverseGeocodeAsync({
        //     latitude: shift.latStart,
        //     longitude: shift.longStart,
        //   });
        // }
        const geocode = [{
          name: 'Schönhauser Allee 38',
          postalCode: '10439',
          city: 'Berlin',
        }];
        [address] = geocode;

        return {
          ...shift,
          startDay: start.format('DD'),
          startMonth: start.format('MMM'),
          fromTime: start.format('HH:mm'), // 'hh:mm a' for am/pm
          toTime: end.format('HH:mm'),
          durationHours: diff,
          address: address,
        };
      });
      futureShifts = await Promise.all(futureShifts);
      this.shifts = futureShifts.sort((a, b) => {
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
