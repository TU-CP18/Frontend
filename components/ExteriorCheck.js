import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Button from './Button';
import AutoHeightImage from './AutoHeightImage';

class ExteriorCheck extends React.Component {
  static getNavigationOptions = (title, { navigation }) => {
    return {
      title: title,
      headerStyle: {
        backgroundColor: '#000000',
        elevation: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: '#ffffff',
      headerRight: (
        <Entypo
          onPress={() => alert('This is a button!')}
          name="chat"
          size={32}
          color="#ffffff"
          style={{ marginRight: 16, marginTop: 6 }}
        />
      ),
    };
  };

  render() {
    const {
      issues,
      image,
      onConfirm,
    } = this.props;

    return (
      <View style={s.container}>
        <AutoHeightImage
          source={image}
          width="100%"
          style={{ marginTop: 10 }}
          resizeMode="contain"
        />

        <View style={s.main}>
          <View style={s.issueList}>
            <View style={{ alignItems: 'center', }}>
              <Text style={{ color: '#ffffff', fontSize: 22, }}>
                Tracked Issues
              </Text>
            </View>

            {issues.slice().length === 0 && (
              <Text style={{ color: '#ffffff', alignSelf: 'center', fontSize: 16, marginTop: 40, }}>
                There are currently no issue tracked
              </Text>
            ) || (
              <View style={{ paddingHorizontal: 20, paddingVertical: 20, }}>
                {issues.slice().map((issue, index) => {
                  console.log("issue", issue);
                  return (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14}}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <Text textAlign="center">
                          {index + 1}
                        </Text>
                      </View>
                      <Text style={{ color: '#ffffff', marginLeft: 20, fontSize: 16, }}>
                        {issue.desc}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View style={s.buttonGroup}>
            <Button
              onPress={onConfirm}
              title="Add Issue"
              iconLeft="Entypo/plus"
              containerStyle={s.addIssueButtonContainer}
              textStyle={s.addIssueText}
            />
            <Button
              onPress={onConfirm}
              title="Confirm"
              wrapperStyle={s.confirmButtonWrapper}
              containerStyle={s.confirmButtonContainer}
            />
          </View>
        </View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  // loadingContainer: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: '#000000',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  main: {
    flex: 1,
  },
  issueList: {
    flex: 1,
  },

  buttonGroup: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  addIssueButtonContainer: {
    borderWidth: 0,
  },
  addIssueText: {
    fontSize: 18,
  },

  confirmButtonWrapper: {
    flex: 1,
    marginLeft: 20,
  },
  confirmButtonContainer: {
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 20,
  },
});

export default ExteriorCheck;
