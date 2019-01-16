import React from 'react';
import { StyleSheet, View } from 'react-native';

const IssueMarker = ({ x, y }) => (
  <View
    style={[
      styles.issueMarkerOuter,
      { left: x - 19, top: y - 19 },
    ]}
  >
    <View style={styles.issueMarkerInner} />
  </View>
);

const styles = StyleSheet.create({
  issueMarkerOuter: {
    position: 'absolute',
    width: 34,
    borderRadius: 24,
    borderWidth: 8,
    borderColor: 'red',
    height: 34,
  },
  issueMarkerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'black',
    position: 'absolute',
    top: 4,
    left: 4,
  },
});

export default IssueMarker;
