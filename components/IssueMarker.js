import React from 'react';
import { StyleSheet, View } from 'react-native';

const IssueMarker = ({ x, y }) => (
  <View
    style={[
      styles.issueMarkerOuter,
      { left: x - 20, top: y - 20 },
    ]}
  >
    <View style={styles.issueMarkerInner} />
  </View>
);

const styles = StyleSheet.create({
  issueMarkerOuter: {
    position: 'absolute',
    width: 34,
    borderRadius: 20,
    borderWidth: 6,
    borderColor: 'black',
    height: 34,
  },
  issueMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    position: 'absolute',
    top: 8,
    left: 8,
  },
});

export default IssueMarker;
