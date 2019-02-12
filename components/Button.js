import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import Icons from '@expo/vector-icons';

const renderIcon = (iconLeft, iconStyle) => {
  if (iconLeft.length) {
    const leftIconName = iconLeft.split('/')[1];
    const LeftIconComponent = Icons[iconLeft.split('/')[0]];
    return (
      <LeftIconComponent
        name={leftIconName}
        style={[s.leftIcon, iconStyle]}
        size={24}
      />
    );
  }

  return (
    <Image
      source={iconLeft}
      style={iconStyle}
    />
  );
};

const Button = ({
  title,
  subtitle,
  children,
  wrapperStyle,
  containerStyle,
  titleStyle,
  subtitleStyle,
  onPress,
  disabled,
  iconLeft,
  rightIcon,
  iconStyle,
  transparent,
  textContainerStyle,
}) => (
  <TouchableOpacity
    style={[s.touchableWrapper, wrapperStyle]}
    onPress={onPress}
    disabled={disabled}
  >
    <View
      style={[
        s.container,
        disabled ? s.disabledContainer : undefined,
        transparent ? s.transparentContainer : undefined,
        containerStyle,
      ]}
    >
      {iconLeft && (
        renderIcon(iconLeft, iconStyle)
      )}
      {(title && (
        (subtitle && (
          <View style={textContainerStyle}>
            <Text style={[s.title, titleStyle]}>
              {title}
            </Text>
            <Text style={[s.subtitle, subtitleStyle]}>
              {subtitle}
            </Text>
          </View>
        )) || (
          <Text style={[s.title, titleStyle]}>
            {title}
          </Text>
        )
      )) || children}
      {rightIcon && (
        renderIcon(rightIcon, iconStyle)
      )}
    </View>
  </TouchableOpacity>
);

const s = StyleSheet.create({
  touchableWrapper: {
    borderRadius: 3,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ffffff',
    backgroundColor: '#000000',
    padding: 12,
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
    color: '#ffffff',
  },
  title: {
    color: '#ffffff',
    alignSelf: 'center',
    fontSize: 18,
  },
  subtitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: -4,
    paddingTop: 0,
  },
});

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  transparent: PropTypes.bool,
  iconLeft: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Button.defaultProps = {
  disabled: false,
  transparent: false,
  iconLeft: undefined,
  onPress: () => {},
};

export default Button;
