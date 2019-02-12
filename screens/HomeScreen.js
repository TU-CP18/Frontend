import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import MapMarker from '../components/MapMarker';
import Header from '../components/Header';
import Button from '../components/Button';
import MenuItem from '../components/MenuItem';

@inject('user', 'nextShift')
@observer
class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.loadNextShift();
  }

  componentWillUnmount() {
    const { nextShift } = this.props;
    nextShift.polling = false;
  }

  loadNextShift = () => {
    const { nextShift } = this.props;
    nextShift.polling = true;
    nextShift.load();
  }

  onPressShiftSchedule = () => {
    const { navigation } = this.props;
    navigation.navigate('Schedule');
  };

  onPressSettings = () => {
    const { navigation } = this.props;
    navigation.navigate('Settings');
  };

  onPressContact = () => {
    const { navigation } = this.props;
    navigation.navigate('Contact');
  };

  onPressNextShift = () => {
    const { navigation } = this.props;
    navigation.navigate('NextShiftMap');
  }

  renderIdleState() {
    const {
      nextShift,
    } = this.props;

    const { loading, shift } = nextShift;

    if (loading) {
      return (
        <View style={[s.nextShiftBlock, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
          <ActivityIndicator
            size="large"
            color="#ffffff"
          />
        </View>
      );
    }

    if (!shift) {
      return (
        <View style={[s.nextShiftBlock, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ color: '#ffffff', marginBottom: 20, fontSize: 24 }}>
            ¯\_(ツ)_/¯
          </Text>
          <Text style={{ color: '#ffffff', marginBottom: 20, fontSize: 24 }}>
            No upcoming Shifts
          </Text>
          <Button
            title="Reload"
            onPress={this.loadNextShift}
            containerStyle={{ backgroundColor: 'transparent', width: 200 }}
          />
        </View>
      );
    }

    const startdate = moment(shift.start);
    const minutesLeft = Math.round(
      moment.duration(startdate.diff(moment())).asMinutes()
    );
    let startDateFormatted = startdate.calendar(null, {
      sameDay: '[Today] hh:mm a',
      nextDay: '[Tomorrow] hh:mm a',
      nextWeek: 'dddd hh:mm a',
      lastDay: '[Yesterday] hh:mm a',
      lastWeek: '[Last] dddd hh:mm a',
      sameElse: 'DD/MM/YYYY hh:mm a',
    });
    if (minutesLeft < 60) {
      startDateFormatted += ` (in ${minutesLeft} minutes)`;
    }

    return (
      <View>
        <TouchableOpacity onPress={this.onPressNextShift}>
          <MapMarker
            style={s.map}
            coordinate={{
              latitude: shift.latStart,
              longitude: shift.longStart,
            }}
          />
        </TouchableOpacity>

        <View style={s.nextShiftBlock}>
          <Header label="Your next Shift" />
          <MenuItem
            label={`${shift.address.name}, ${shift.address.postalCode} ${shift.address.city}`}
            icon="FontAwesome/map-marker"
            iconStyle={{ marginLeft: 3 }}
            separator={false}
          />
          <MenuItem
            label={startDateFormatted}
            icon="Ionicons/md-time"
            separator={false}
          />
          <MenuItem
            label="Remember to confirm your arrival at the interchange point to start the shift!"
            separator={false}
          />
          <Button
            title="Show Start Position"
            onPress={this.onPressNextShift}
            containerStyle={{ backgroundColor: 'transparent', padding: 8, borderWidth: 0, justifyContent: 'flex-end'}}
            textStyle={{ fontSize: 16, paddingRight: 6 }}
            rightIcon="Feather/arrow-right"
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={s.container}>
        {this.renderIdleState()}

        <View style={s.menu}>
          <MenuItem
            label="See shift schedule"
            icon="FontAwesome/calendar"
            onPress={this.onPressShiftSchedule}
          />

          <MenuItem
            label="Settings"
            icon="FontAwesome/gears"
            onPress={this.onPressSettings}
          />

          <MenuItem
            label="Contact Fleet Manager"
            icon="Entypo/chat"
            onPress={this.onPressContact}
            separator={false}
          />
        </View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },

  map: {
    width: '100%',
    height: 300,
    flex: 0,
  },
  nextShiftBlock: {
    paddingHorizontal: 20,
    backgroundColor: '#36558F',
    paddingBottom: 10,
    paddingTop: 5,
  },

  menu: {
    marginBottom: 20,
    marginHorizontal: 20,
    marginTop: 30,
  },
});

export default HomeScreen;
