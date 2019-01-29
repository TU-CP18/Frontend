import React from 'react';
import MapRoute from '../components/MapRoute';

class MapScreen extends React.Component {
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
    const { navigation } = this.props;

    return (
      <MapRoute
        showConfirmationButton={false}
        showNavigationButton={false}
        showDirections={navigation.getParam('showDirections') !== false}
        latitude={navigation.getParam('latitude')}
        longitude={navigation.getParam('longitude')}
        initialFocus={(navigation.getParam('initialFocus')) ? navigation.getParam('initialFocus') : 'interchangePoint'}
      />
    );
  }
}

export default MapScreen;
