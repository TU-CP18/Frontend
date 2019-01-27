import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

const IssueMarker = ({ x, y, number }) => (
  <View
    style={[
      s.issueMarkerOuter,
      { left: x - 18, top: y - 18 },
    ]}
  >
    <View style={s.issueMarkerInner}>
      {number && (<Text style={s.number}>{number}</Text>)}
    </View>
  </View>
);

const s = StyleSheet.create({
  issueMarkerOuter: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  issueMarkerInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 3,
    left: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

IssueMarker.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  number: PropTypes.number,
};

IssueMarker.defaultProps = {
  x: 0,
  y: 0,
  number: undefined,
}

export default IssueMarker;
