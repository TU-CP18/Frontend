import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { FontAwesome } from '@expo/vector-icons';
import LoadingIndicator from '../components/LoadingIndicator';

@inject('shiftSchedule')
@observer
class ScheduleScreen extends React.Component {
  static navigationOptions = {
    title: 'Shift Schedule',
    headerStyle: {
      backgroundColor: '#000000',
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: '#ffffff',
  };

  componentDidMount() {
    const { shiftSchedule } = this.props;
    shiftSchedule.load();
  }

  keyExtractor = item => `${item.id}`;

  onItemPress = item => {
    const { navigation } = this.props;

    navigation.navigate('Map', {
      latitude: item.latStart,
      longitude: item.longStart,
    });
  }

  renderItem = ({ item, index }) => {
    const separator = index !== 0;

    return (
      <View>
        {separator && (
          <View style={s.separator} />
        )}
        <TouchableOpacity onPress={() => this.onItemPress(item)}>
          <View style={s.item}>
            <View style={s.dateColumn}>
              <Text style={s.dayRow}>
                {item.startDay}
              </Text>
              <Text style={s.monthRow}>
                {item.startMonth}
              </Text>
            </View>
            <View style={s.contentColumn}>
              <Text style={s.time}>
                {`${item.fromTime} - ${item.toTime} (${item.durationHours} hours)`}
              </Text>
              <Text style={s.address}>
                {(item.address.street
                  && `${item.address.street}, ${item.address.postalCode} ${item.address.city}`)
                  || 'No location assigned yet'
                }
              </Text>
            </View>
            {item.latStart && (
              <FontAwesome
                name="map-marker"
                size={28}
                color="#ffffff"
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { shiftSchedule } = this.props;
    const { shifts, loading, error } = shiftSchedule;

    return (
      <View style={s.container}>
        {loading && <LoadingIndicator />}
        {error && (
          <View style={s.errorWrapper}>
            <Text style={s.error}>Something went wrong ...</Text>
            <Text style={s.error}>Please try it again later</Text>
          </View>
        )}
        {!loading && !error && shifts && shifts.slice().length > 0 && (
          <FlatList
            data={shifts.slice()}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        )}
        {!loading && !error && shifts && shifts.slice().length === 0 && (
          <View style={s.errorWrapper}>
            <Text style={s.error}>There are currently</Text>
            <Text style={s.error}>no shifts assigned to you</Text>
          </View>
        )}
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
  },
  errorWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 20,
    color: '#ffffff',
    alignContent: 'center',
  },
  heading: {
    marginTop: 10,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ffffff',
  },
  item: {
    flexDirection: 'row',
    marginVertical: 16,
    alignItems: 'center',
  },
  dateColumn: {
    marginRight: 14,
    alignItems: 'center',
  },
  dayRow: {
    color: '#ffffff',
    fontSize: 16,
  },
  monthRow: {
    color: '#ffffff',
    fontSize: 14,
  },
  contentColumn: {
    flex: 1,
  },
  time: {
    color: '#ffffff',
    fontSize: 16,
  },
  address: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ScheduleScreen;
