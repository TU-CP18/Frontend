import { observable } from 'mobx';
import { Location } from 'expo';
import moment from 'moment';
import api from '../helpers/api';

export default class ShiftSchedule {
  @observable shifts = null;

  @observable loading = true;

  @observable error = false;

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

        // reverseGeocodeAsync leads to an app crash when the lat long values are not
        // correct, watch out to use correct values or hardcode an example:
        // const geocode = [{
        //   name: 'Schönhauser Allee 38',
        //   postalCode: '10439',
        //   city: 'Berlin',
        // }];
        // [address] = geocode;

        if (global.devSettings.settings.get('fakeApi')) {
          address = shift.address;
        } else if (locationServicesEnabled && shift.latStart && shift.longStart) {
          [address] = await Location.reverseGeocodeAsync({
            latitude: shift.latStart,
            longitude: shift.longStart,
          });
        }

        return {
          ...shift,
          startDay: start.format('DD'),
          startMonth: start.format('MMM'),
          fromTime: start.format('HH:mm'), // use 'hh:mm a' for am/pm
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
      this.error = true;
      console.log(e);
    } finally {
      this.loading = false;
    }
  }
}
