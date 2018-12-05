import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Rating = ({
  rating,
  onRate,
  count,
  style,
}) => (
  <View style={[styles.container, style]}>
    {[...Array(count).keys()].map((index) => {
      const active = index < rating;
      return (
        <Ionicons
          key={index}
          name={active ? 'ios-star' : 'ios-star-outline'}
          onPress={() => onRate(index + 1)}
          size={42}
          style={styles.icon}
        />
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 5,
    color: 'black',
  },
});

Rating.propTypes = {
  rating: PropTypes.number,
  onRate: PropTypes.func,
  count: PropTypes.number,
};

Rating.defaultProps = {
  rating: 0,
  count: 5,
  onRate: () => undefined,
};

export default Rating;
