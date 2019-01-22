import React from 'react';
import PropTypes from 'prop-types';
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
  Location,
  Permissions,
  IntentLauncherAndroid,
} from 'expo';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import geolib from 'geolib';
import Polyline from '@mapbox/polyline';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import MapboxClient from 'mapbox';
import { lineString } from '@turf/helpers';
import api from '../helpers/api';
import lib from '../helpers/lib';
import appConfig from '../app.json';

const { width, height } = Dimensions.get('window');

Mapbox.setAccessToken('pk.eyJ1IjoiY3BkYWltbGVyIiwiYSI6ImNqcG8xa3FxcDA5Njk0MnQyZWZ4Y2pmNXcifQ.7DfnpBxFa3kFr1vSew8izA');

class MapRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: [],
      route: null,
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
  }

  async componentDidMount() {
    // ask the user for location permission
    const { locationServicesEnabled } = await Location.getProviderStatusAsync();
    if (!locationServicesEnabled) {
      IntentLauncherAndroid.startActivityAsync(
        IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS,
      );
      return;
    }
    if (await !lib.isPermissionGranted(Permissions.LOCATION)) {
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
    await this.getDirections(currentLocation, destinationLocation);
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
  getLocation = async () => {
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
  };

  /**
   * retrieves the coordinates of a route
   * route: safety drivers position to the interception point
   * @param startLoc
   * @param destinationLoc
   * @returns {Promise<*>}
   */
  getDirections = async (startLoc, destinationLoc) => {
    const client = new MapboxClient('pk.eyJ1IjoiY3BkYWltbGVyIiwiYSI6ImNqcG8xa3FxcDA5Njk0MnQyZWZ4Y2pmNXcifQ.7DfnpBxFa3kFr1vSew8izA');
    const res = await client.getDirections(
      [
        startLoc,
        destinationLoc,
      ],
      { profile: 'driving', geometry: 'polyline' },
    );
    const coordinates = res.entity.routes[0].geometry.coordinates.map(point => {
      return {
        latitude: point[1],
        longitude: point[0],
      };
    });
    this.setState({
      route: lineString(res.entity.routes[0].geometry.coordinates),
      coordinates: coordinates,
    });
  };

  /**
   * get the coordinates of the interception point
   * @returns {Promise<*>}
   */
  getInterceptionCoords = async () => {
    /*
    try {
      const response = await api.get('/shifts/next');
      if (response.status !== 200) {
        // this will execute the catch block
        throw new Error('Fetching the coordinates of the interception point failed');
      }
      const { latStart, longStart } = response.data;
      return {
        latitude: latStart,
        longitude: longStart,
      };
    } catch (error) {
      console.error(error);
      return error;
    }
    */
    return {
      latitude: 52.5219,
      longitude: 13.413492,
    };
  };

  checkUserLocation = async location => {
    const { coordinates } = this.state;
    const { coords } = location;
    // follow the user location
    this.animateToCoordinates(coords);
    const destinationCoords = coordinates[coordinates.length - 1];
    const distance = geolib.getDistance(coords, destinationCoords);
    // show button if user is close to destination so he can confirm arrival
    // remove arrival button in case the user moves away from the destination
    this.setState({ destinationReached: (distance <= 20) });
  };

  /**
   * animate to specified coordinates on the map
   * @param coords
   */
  animateToCoordinates = async coords => {
    const { focusedLocation } = this.state;
    const { latitude, longitude } = coords;
    if (focusedLocation && latitude && longitude) {
      this.map.flyTo([longitude, latitude]);
    }
  };

  renderConfirmalButton() {
    const { onArrivalConfirmed } = this.props;
    const { destinationReached } = this.state;
    if (!destinationReached) {
      return null;
    }
    return (
      <View style={styles.confirmContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={onArrivalConfirmed}
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

  onMapReady = () => {
    this.setState({ isMapReady: true });
  };

  render() {
    const { route, coordinates, focusedLocation, isMapReady } = this.state;
    /*
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={focusedLocation}
          showsUserLocation
          followsUserLocation={Platform.OS === 'ios'}
          loadingEnabled
          ref={map => { this.map = map; }}
          onMapReady={this.onMapReady}
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
    */
    return (
      <View style={styles.container}>
        <Mapbox.MapView
          styleURL={Mapbox.StyleURL.Street}
          zoomLevel={20}
          maxZoomLevel={20}
          centerCoordinate={[13.4132147, 52.5219184]}
          showUserLocation
          userTrackingMode={Mapbox.UserTrackingModes.FollowWithHeading}
          logoEnabled={false}
          ref={map => { this.map = map; }}
          onDidFinishRenderingMap={this.onMapReady}
          style={styles.map}
        >
          {route !== null && (
            <Mapbox.ShapeSource id="routeSource" shape={route}>
              <Mapbox.LineLayer
                id="routeFill"
                style={layerStyles.route}
              />
            </Mapbox.ShapeSource>
          )}
        </Mapbox.MapView>
        {coordinates.length > 0 && (
          <Mapbox.PointAnnotation
            id="annotation"
            title="Hallo"
            coordinate={[13.4132147, 52.5219184]}
          >
          </Mapbox.PointAnnotation>
        )}
        {this.renderConfirmalButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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

const layerStyles = Mapbox.StyleSheet.create({
  route: {
    lineColor: 'blue',
    lineWidth: 4,
    lineOpacity: 1,
  },
});

MapRoute.propTypes = {
  onArrivalConfirmed: PropTypes.func,
};

MapRoute.defaultProps = {
  onArrivalConfirmed: () => undefined,
};

export default MapRoute;
