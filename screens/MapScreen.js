import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
} from 'react-native';
import {
  MapView,
  Location,
  Permissions,
} from 'expo';
import axios from 'axios';
import Polyline from '@mapbox/polyline';
import api from '../helpers/api';
import appConfig from '../app.json';

class MapScreen extends React.Component {
  static navigationOptions = {
    title: 'Map',
  };

  constructor(props) {
    super(props);

    this.state = {
      coordinates: [],
      focusedLocation: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.03,
        longitudeDelta: Dimensions.get('window').width
          / Dimensions.get('window').height
          * 0.03,
      },
    };

    this.apikey = appConfig.expo.android.config.googleMaps.apiKey;
    // bind this in constructor so state can be set in these methods
    this.getLocation = this.getLocation.bind(this);
    this.getDirections = this.getDirections.bind(this);
  }

  async componentWillMount() {
    // get the current location of the user
    const currentLocation = await this.getLocation();
    // retrieve the destination location where the users shift will start
    const destinationLocation = await this.getInterceptionCoords();
    // retrieve a direction between these two points
    await this.getDirections(currentLocation, destinationLocation);
    // monitor the current position of the user
    this.watchid = await Location.watchPositionAsync({
      enableHighAccuracy: true,
      distanceInterval: 1,
    }, this.checkUserLocation);
  }

  componentWillUnmount() {
    this.watchid.remove();
  }

  async getLocation() {
    // ask the user for location permission
    // TODO: catch that location is not granted and refactor in methods
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      // get current position if permission has been granted
      const { coords } = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      const { focusedLocation } = this.state;
      // initalize map at current position
      this.map.animateToRegion({
        ...focusedLocation,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      this.setState(prevState => {
        return {
          focusedLocation: {
            ...prevState.focusedLocation,
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        };
      });
      return {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
    }
    throw new Error('Location permission not granted');
  }

  /**
   * retrieves the coordinates of a route
   * route: safety drivers position to the interception point
   * @param startLoc
   * @param destinationLoc
   * @returns {Promise<*>}
   */
  async getDirections(startLoc, destinationLoc) {
    try {
      const options = {
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/directions/json',
        params: {
          origin: Object.values(startLoc).join(','),
          destination: Object.values(destinationLoc).join(','),
          key: this.apikey,
        },
        responseType: 'json',
        headers: {},
      };
      const response = await axios(options);
      if (response.status !== 200) {
        // this will execute the catch block
        throw new Error('Fetching the coordinates of the interception point failed');
      }
      const { data } = response;
      if (data.status !== 'OK') {
        throw new Error('Determining a route between the two points failed');
      }
      const points = Polyline.decode(data.routes[0].overview_polyline.points);
      const coordinates = points.map(point => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      this.setState({ coordinates: coordinates });
      return coordinates;
    } catch (error) {
      console.log(error);
      Alert.alert('Network error', error);
      return error;
    }
  }

  /**
   * get the coordinates of the interception point
   * @returns {Promise<*>}
   */
  getInterceptionCoords = async () => {
    try {
      const response = await api.get('/shifts/next');
      if (response.status !== 200) {
        // this will execute the catch block
        throw new Error('Fetching the coordinates of the interception point failed');
      }
      const { data } = response;
      return {
        latitude: data.latStart,
        longitude: data.longStart,
      };
    } catch (error) {
      console.log(error);
      Alert.alert('Network error', error);
      return error;
    }
  };

  checkUserLocation = coords => {
    // TODO: find out how far the coordinates are from the destination
    // TODO: if closer than 10 metres show confirm arrival
    // TODO: optionally draw new route if user is far away from original route
    console.log(coords);
  };

  render() {
    // TODO: only provide a marker with destination if prop is set
    const { coordinates, focusedLocation } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={focusedLocation}
          showsUserLocation
          followsUserLocation
          loadingEnabled
          ref={map => { this.map = map; }}
        >
          <MapView.Polyline
            coordinates={coordinates}
            strokeWidth={3}
            strokeColor="blue"
          />
          {coordinates.length > 0 && (
            <MapView.Marker
              coordinate={coordinates[coordinates.length - 1]}
            />
          )}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
