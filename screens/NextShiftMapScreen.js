import React from 'react';
import { observer, inject } from 'mobx-react';
import { Alert } from 'react-native';
import MapRoute from '../components/MapRoute';
import api from '../helpers/api';

@inject('nextShift')
@observer
class NextShiftMapScreen extends React.Component {
  static navigationOptions = {
    title: 'Interchange Location',
    headerStyle: {
      backgroundColor: '#000000',
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: '#ffffff',
  };

  onPressArrivalConfirmed = async () => {
    const { navigation, nextShift } = this.props;

    try {
      const res = await api.post(`/shifts/${nextShift.shift.id}/track`, { state: 'confirmedArrival' });
      if (res.status !== 200) {
        console.log('error when confirming arrival', res);
      }
    } catch (error) {
      console.log('error when confirming arrival', error);
    }
    // we redirect the user no matter the response as the purpose is solely tracking
    navigation.navigate('RidePreparation');
  };

  render() {
    const { nextShift } = this.props;

    return (
      <MapRoute
        onArrivalConfirmed={this.onPressArrivalConfirmed}
        latitude={nextShift.shift.latStart}
        longitude={nextShift.shift.longStart}
      />
    );
  }
}

export default NextShiftMapScreen;
