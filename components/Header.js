import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

const Header = ({ label, separator, style }) => (
  <View style={[s.container, style]}>
    <Text style={s.label}>
      {label}
    </Text>
    {separator && (
      <View style={s.separator} />
    )}
  </View>
);

const s = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
  separator: {
    height: 2,
    width: '22%',
    backgroundColor: '#ffffff',
  },
});

Header.propTypes = {
  label: PropTypes.string,
  separator: PropTypes.bool,
};

Header.defaultProps = {
  label: '',
  separator: true,
};

export default Header;
