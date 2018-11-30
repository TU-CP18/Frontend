import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import {
  MapView,
  Location,
  Permissions,
  Constants,
} from 'expo';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import geolib from 'geolib';
import Polyline from '@mapbox/polyline';
import api from '../helpers/api';
import appConfig from '../app.json';

const { width, height } = Dimensions.get('window');

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
        latitudeDelta: 0.0122,
        longitudeDelta: width / height * 0.0122,
      },
      destinationReached: false,
      isMapReady: false,
    };

    this.apikey = appConfig.expo.android.config.googleMaps.apiKey;
    // bind this in constructor so state can be set in these methods
    this.getLocation = this.getLocation.bind(this);
    this.getDirections = this.getDirections.bind(this);
    this.checkUserLocation = this.checkUserLocation.bind(this);
    this.animateToCoordinates = this.animateToCoordinates.bind(this);
  }

  async componentDidMount() {
    // ask the user for location permission
    if (Platform.OS === 'android' && !Constants.isDevice) {
      Alert.alert('Warning', 'This will not work on sketch in an android emulator. Try it on your device!');
      return;
    }
    if (await !this.isPermissionGranted(Permissions.LOCATION)) {
      Alert.alert('Permission', 'You need to enable location services');
      return;
    }
    // get the current location of the user
    // retrieve the destination location where the users shift will start
    const [currentLocation, destinationLocation] = await Promise.all([
      this.getLocation(),
      this.getInterceptionCoords(),
    ]);
    // retrieve a direction between these two points
    this.getDirections(currentLocation, destinationLocation);
    // monitor the current position of the user
    this.watchid = await Location.watchPositionAsync({
      enableHighAccuracy: true,
      distanceInterval: 1,
    }, this.checkUserLocation);
  }

  componentWillUnmount() {
    if (this.watchid) {
      this.watchid.remove();
    }
  }

  /**
   * retrieve current coordinates and move to them on the map
   * assumes that location permission has already been granted
   * @returns {Promise<{latitude: (number|*|string), longitude: (number|*|string)}>}
   */
  async getLocation() {
    // get current position if permission has been granted
    const { coords } = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    // initalize map at current position
    this.animateToCoordinates(coords);
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

  /**
   * retrieves the coordinates of a route
   * route: safety drivers position to the interception point
   * @param startLoc
   * @param destinationLoc
   * @returns {Promise<*>}
   */
  async getDirections(startLoc, destinationLoc) {
    const startCoords = Object.values(startLoc);
    const destinationCoords = Object.values(destinationLoc);
    if (startCoords.length !== 2 || destinationCoords.length !== 2) {
      console.error('Given coordinates have wrong format');
      return {};
    }
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/directions/json',
        params: {
          origin: startCoords.join(','),
          destination: destinationCoords.join(','),
          key: this.apikey,
        },
        responseType: 'json',
        headers: {},
      });
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
      console.error(error);
      return error;
    }
  }

  /**
   * get the coordinates of the interception point
   * @returns {Promise<*>}
   */
  async getInterceptionCoords() {
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
      console.error(error);
      return error;
    }
  }

  checkUserLocation(location) {
    const { coordinates } = this.state;
    const { coords } = location;
    if (Platform.OS === 'android') {
      // follow the user location
      // mapview component handles this for ios devices
      this.animateToCoordinates(coords);
    }
    const destinationCoords = coordinates[coordinates.length - 1];
    const distance = geolib.getDistance(coords, destinationCoords);
    if (distance <= 20) {
      // distance to destination is shorter than 20 metres
      // show button so user can confirm arrival
      this.setState({ destinationReached: true });
    } else {
      // remove arrival button in case the user moves away from the destination
      this.setState({ destinationReached: false });
    }
  }

  /**
   * animate to specified coordinates on the map
   * @param coords
   */
  animateToCoordinates(coords) {
    const { focusedLocation } = this.state;
    const { latitude, longitude } = coords;
    if (focusedLocation && latitude && longitude) {
      this.map.animateToRegion({
        ...focusedLocation,
        latitude: latitude,
        longitude: longitude,
      });
    }
  }

  renderConfirmalButton() {
    const { destinationReached } = this.state;
    if (!destinationReached) {
      return null;
    }
    return (
      <View style={styles.confirmContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={this.onArrivalConfirmed}
        >
          <View style={styles.drawerItem}>
            <Ionicons
              name="ios-checkmark-circle-outline"
              size={30}
              color="#ffffff"
              style={styles.drawerItemIcon}
            />
            <Text style={styles.buttonText}>Confirm Arrival</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  isPermissionGranted = async permission => {
    const { status } = await Permissions.askAsync(permission);
    return (status === 'granted');
  };

  onArrivalConfirmed = () => {
    Alert.alert('Confirmation', 'Arrival confirmed');
  };

  onMapReady = () => {
    this.setState({ isMapReady: true });
  };

  render() {
    const { coordinates, focusedLocation, isMapReady } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={focusedLocation}
          showsUserLocation
          followsUserLocation={Platform.OS === 'ios'}
          loadingEnabled
          ref={map => { this.map = map; }}
          onMapReady={() => this.onMapReady()}
        >
          <MapView.Polyline
            coordinates={coordinates}
            strokeWidth={3}
            strokeColor="blue"
          />
          {isMapReady && coordinates.length > 0 && (
            <MapView.Marker
              coordinate={coordinates[coordinates.length - 1]}
            />
          )}
        </MapView>
        {this.renderConfirmalButton()}
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
    width: width,
    height: height,
  },
  confirmContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 150,
    width: '100%',
    justifyContent: 'center',
  },
  confirmButton: {
    paddingHorizontal: 30,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 15,
  },
  drawerItemIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 22,
  },
});

export default MapScreen;
