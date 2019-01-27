import React from 'react';
import { observer, inject } from 'mobx-react';
import MapRoute from '../components/MapRoute';

@inject('nextShift', 'currentShift')
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
    const {
      navigation,
      nextShift,
      currentShift,
    } = this.props;

    // TODO: add buttonLoading prop to MapRoute
    await currentShift.startShift(nextShift.shift);

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
