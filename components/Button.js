import React from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

const Button = ({
  title,
  children,
  wrapperStyle,
  containerStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.touchableWrapper, wrapperStyle]}
      onPress={onPress}
    >
      <View style={[styles.container, containerStyle]}>
        {(title && (
          <Text>
            {title}
          </Text>
        )) || children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableWrapper: {
    borderRadius: 3,
  },
  container: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#000000',
    alignSelf: 'center',
  },
});

export default Button;
