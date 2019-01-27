import React from 'react';
import { observer, inject } from 'mobx-react';
import MapRoute from '../components/MapRoute';

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

  render() {
    const { navigation, nextShift } = this.props;

    return (
      <MapRoute
        onArrivalConfirmed={() => navigation.navigate('RidePreparation')}
        latitude={nextShift.shift.latStart}
        longitude={nextShift.shift.longStart}
      />
    );
  }
}

export default NextShiftMapScreen;
