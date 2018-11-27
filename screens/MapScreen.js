import React from 'react';
import MapRoute from '../components/MapRoute';

class MapScreen extends React.Component {
  static navigationOptions = {
    title: 'Map',
  };

  render() {
    const { navigation } = this.props;

    return (
      <MapRoute />
    );
  }
}

export default MapScreen;
