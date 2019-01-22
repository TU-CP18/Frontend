import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
// import PropTypes from 'prop-types';

const LoadingIndicator = () => (
  <View style={s.container}>
    <ActivityIndicator
      color="#ffffff"
      size="large"
    />
  </View>
);

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator;
