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
import Icons from '@expo/vector-icons';
import MapMarker from '../components/MapMarker';
import Header from '../components/Header';
import Button from '../components/Button';

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
    navigation.navigate('Ride');
  };

  onPressNextShift = () => {
    const { navigation } = this.props;
    navigation.navigate('NextShiftMap');
  }

  Item = ({
    icon,
    iconStyle,
    label,
    separator = true,
  }) => {
    const Icon = Icons[icon.split('/')[0]];
    const iconName = icon.split('/')[1];

    return (
      <View style={[s.item, separator ? s.itemSeparator : {}]}>
        <View style={{ flex: 1 }}>
          <Icon
            name={iconName}
            style={[s.itemIcon, iconStyle]}
          />
        </View>
        <Text style={s.itemLabel}>
          {label}
        </Text>
      </View>
    );
  }

  MenuItem = ({ onPress, ...rest }) => (
    <TouchableOpacity
      style={s.menuItemTouchable}
      onPress={onPress}
    >
      <this.Item {...rest} />
    </TouchableOpacity>
  );

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
          <this.Item
            label={`${shift.address.name}, ${shift.address.postalCode} ${shift.address.city}`}
            icon="FontAwesome/map-marker"
            iconStyle={{ marginLeft: 3 }}
            separator={false}
          />
          <this.Item
            label={startDateFormatted}
            icon="Ionicons/md-time"
            separator={false}
          />
          <View style={[s.item, { marginTop: -15, paddingBottom: 5 }]}>
            <View style={{ flex: 1 }} />
            <Text style={[s.itemLabel, { fontSize: 14 }]}>
              Remember to confirm your arrival at the interchange point to start the shift!
            </Text>
          </View>
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
    const { MenuItem } = this;

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

  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#C2C2C2',
    paddingBottom: 15,
    marginBottom: 15,
  },
  itemIcon: {
    marginRight: 14,
    color: '#ffffff',
    fontSize: 26,
  },
  itemLabel: {
    flex: 7,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  menu: {
    marginBottom: 20,
    marginHorizontal: 20,
    marginTop: 30,
  },
  menuItemTouchable: {
    alignItems: 'center',
  },
});

export default HomeScreen;
