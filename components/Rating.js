import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Rating = ({
  rating,
  onRate,
  count,
  style,
}) => (
  <View style={[s.container, style]}>
    {[...Array(count).keys()].map(index => {
      const active = index < rating;
      return (
        <FontAwesome
          key={index}
          name={active ? 'star' : 'star-o'}
          onPress={() => onRate(index + 1)}
          color="#ffffff"
          size={42}
          style={s.icon}
        />
      );
    })}
  </View>
);

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  icon: {
    marginRight: 5,
  },
});

Rating.propTypes = {
  rating: PropTypes.number,
  onRate: PropTypes.func,
  count: PropTypes.number,
  style: PropTypes.object,
};

Rating.defaultProps = {
  rating: 0,
  count: 5,
  onRate: () => undefined,
  style: {},
};

export default Rating;
