import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';

const CarCheckItem = ({
  title,
  checked,
  onPressCheck,
  onPressAddIssue,
  issues,
}) => {
  return (
    <View style={styles.checkItem}>
      <View style={styles.actionsRow}>
        <CheckBox
          title={title}
          checked={checked}
          textStyle={styles.checkBoxText}
          containerStyle={styles.checkboxContainer}
          onPress={onPressCheck}
        />
        <FontAwesome
          onPress={onPressAddIssue}
          name="plus"
          size={20}
          style={{
            paddingRight: 8,
            paddingLeft: 40,
            color: '#617D8A',
          }}
        />
      </View>
      <View style={styles.issuesList}>
        {issues.map((issue, index) => (
          <Text key={index}>{`- ${issue}`}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  checkItem: {
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderColor: '#EDEDED',
    borderWidth: 1,
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkBoxText: {
    marginBottom: 1,
  },
  checkboxContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    marginLeft: 0,
  },
  addIssuesIcon: {
    paddingRight: 8,
    paddingLeft: 40,
    color: '#617D8A',
  },
  issuesList: {
    paddingLeft: 35,
  },
});

export default CarCheckItem;
