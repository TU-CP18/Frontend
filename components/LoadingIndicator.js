import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';

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
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});

export default LoadingIndicator;
