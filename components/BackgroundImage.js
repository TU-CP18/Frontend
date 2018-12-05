import React from 'react';
import { StyleSheet, Image } from 'react-native';

export class BackgroundImage extends React.Component {
  render() {
    return (
      <Image
        style={styles.backgroundImage}
        source={require('../assets/images/background_van.jpg')}
        blurRadius={5}
      />
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    height: '125%',
    opacity: 0.5,
  }
});