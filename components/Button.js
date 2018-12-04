import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icons from '@expo/vector-icons';

const Button = ({
  title,
  subtitle,
  children,
  wrapperStyle,
  containerStyle,
  textStyle,
  subtitleStyle,
  onPress,
  disabled,
  iconLeft,
  iconStyle,
  transparent,
}) => {
  let LeftIconComponent;
  let leftIconName;

  if (iconLeft) {
    leftIconName = iconLeft.split('/')[1];
    LeftIconComponent = Icons[iconLeft.split('/')[0]];
  }

  return (
    <TouchableOpacity
      style={[styles.touchableWrapper, wrapperStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      <View
        style={[
          styles.container,
          disabled ? styles.disabledContainer : undefined,
          transparent ? styles.transparentContainer : undefined,
          containerStyle,
        ]}
      >
        {iconLeft && (
          <LeftIconComponent
            name={leftIconName}
            style={[styles.leftIcon, iconStyle]}
            size={24}
          />
        )}
        {(title && (
          (subtitle && (
            <View>
              <Text style={textStyle}>
                {title}
              </Text>
              <Text style={[styles.subtitle, subtitleStyle]}>
                {subtitle}
              </Text>
            </View>
          )) || (
            <Text style={textStyle}>
              {title}
            </Text>
          )
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
    flexDirection: 'row',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledContainer: {
    opacity: 0.4,
  },
  transparentContainer: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  leftIcon: {

  },
  title: {
    color: '#000000',
    alignSelf: 'center',
  },
  subtitle: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: -4,
    marginTop: 0,
    paddingTop: 0,
  },
});

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  transparent: PropTypes.bool,
  iconLeft: PropTypes.string,
};

Button.defaultProps = {
  disabled: false,
  transparent: false,
  iconLeft: undefined,
};

export default Button;
