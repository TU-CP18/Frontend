import React from 'react';
import MapRoute from '../components/MapRoute';

class MapScreen extends React.Component {
  static navigationOptions = {
    title: 'Map',
  };

  render() {
    const { navigation } = this.props;

    return (
      <MapRoute
        onArrivalConfirmed={() => navigation.navigate('RidePreparation')}
      />
    );
  }
}

export default MapScreen;
