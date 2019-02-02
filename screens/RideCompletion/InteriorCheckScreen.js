import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import { observer, inject, disposeOnUnmount } from 'mobx-react';
import { reaction } from 'mobx';
import { StackActions, NavigationActions } from 'react-navigation';
import { Entypo } from '@expo/vector-icons';
import Rating from '../../components/Rating';
import Button from '../../components/Button';

@inject('issues', 'alert', 'currentShift')
@observer
class InteriorCheckScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Interior Check',
      headerStyle: {
        backgroundColor: '#000000',
        elevation: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: '#ffffff',
      headerRight: (
        <Entypo
          onPress={() => navigation.navigate('Contact')}
          name="chat"
          size={32}
          color="#ffffff"
          style={{ marginRight: 16, marginTop: 6 }}
        />
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      rating: -1,
      issueFormVisible: false,
      issueDesc: '',
    };
  }

  componentDidMount() {
    const {
      issues,
      currentShift,
      navigation,
    } = this.props;

    // react so insertLoading change in the issues store
    const insertReaction = reaction(
      // react so insertLoading change in the issues store
      () => issues.insertLoading,
      // reaction callback
      loading => {
        if (!loading && !issues.insertError) {
          // when inserting is done and there has been no error
          // switch back to the issue list view
          LayoutAnimation.easeInEaseOut();
          this.setState({
            issueFormVisible: false,
            issueDesc: '',
          });
        }
      },
    );

    // react so insertLoading change in the issues store
    const carClosedReaction = reaction(
      // react so insertLoading change in the issues store
      () => currentShift.closeCarSucceeded,
      // reaction callback
      succeeded => {
        if (!succeeded) return;

        // Reset the stack so that the user cannot return from the
        // interior inspection to the exterior inspection screen.
        // Another approach could be to create another sub-navigation-stack
        // see /navigation/RidePreparationNavigator.js
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'ExteriorCheckStart' })],
        });
        navigation.dispatch(resetAction);
      },
    );

    // dispose reaction when unmounting this component
    disposeOnUnmount(this, [insertReaction, carClosedReaction]);
  }

  /**
   * Show confirmation request, close car and transit to the exterior check.
   */
  onPressCloseCar = () => {
    const {
      alert,
      currentShift,
    } = this.props;
    const {
      rating,
    } = this.state;

    if (rating === -1) {
      alert.show(
        'Rating missing',
        'Please rate the cleanliness of the interior before you proceed',
      );
      return;
    }

    Alert.alert(
      'Confirmation Request',
      'Confirm that you checked the interior accordingly, forgot nothing in the car and left the'
      + ' vehicle.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => currentShift.closeCar(rating),
        },
      ],
      { cancelable: true },
    );
  }

  /**
   * Shows the issue form.
   */
  showIssueForm = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      issueFormVisible: true,
    });
  }

  /**
   * Hies the issue form.
   */
  hideIssueForm = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      issueFormVisible: false,
    });
  }

  /**
   * Creates a new issue for the interior. Only the description is required for the interior.
   */
  createIssue = () => {
    const {
      issues,
      alert,
    } = this.props;
    const {
      issueDesc,
    } = this.state;

    if (!issueDesc || issueDesc.length === 0) {
      alert.show('Description missing', 'Please provide a description for the issue');
      return;
    }

    issues.addIssue(
      0,
      0,
      'interior/general',
      issueDesc,
    );
  }

  render() {
    const {
      issues,
    } = this.props;
    const {
      rating,
      issueFormVisible,
      issueDesc,
    } = this.state;

    const issueList = issues.issues.slice().filter(issue => {
      return issue.part.startsWith('interior');
    });

    return (
      <View style={s.caroussel}>
        <View style={[s.main, { marginLeft: issueFormVisible ? '-100%' : 0 }]}>
          <View style={s.content}>
            <Text style={[s.guideText, { marginTop: 10 }]}>
              Please track new issues of the interior before closing the car.
            </Text>

            <Text style={s.titleText}>
              Existing Issues
            </Text>

            {issueList.length === 0 && (
              <Text style={[s.guideText, { marginBottom: 40 }]}>
                There are currently no issue tracked
              </Text>
            ) || (
              <ScrollView>
                {issueList.map((issue, index) => {
                  return (
                    <View key={issue.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14}}>
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
                      <Text
                        style={{
                          color: '#ffffff',
                          marginLeft: 20,
                          fontSize: 16,
                          marginRight: 20,
                        }}
                        numberOfLines={3}
                      >
                        {issue.description}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            )}

            <Text style={s.titleText}>
              Interior Cleanliness
            </Text>
            <Text style={[s.guideText, s.guideTextCleanliness]}>
              Please also rate cleanliness of the interior.
            </Text>
            <Rating
              rating={rating}
              onRate={userRating => this.setState({ rating: userRating })}
              style={s.rating}
            />
          </View>

          <View style={s.buttonGroup}>
            <Button
              onPress={this.showIssueForm}
              title="Add Issue"
              iconLeft="Entypo/plus"
              containerStyle={s.addIssueButtonContainer}
              textStyle={s.addIssueText}
            />
            <Button
              onPress={this.onPressCloseCar}
              title="Close the Car"
              wrapperStyle={s.confirmButtonWrapper}
              containerStyle={s.confirmButtonContainer}
              iconLeft="FontAwesome/unlock"
              iconStyle={{ position: 'absolute', top: 12, left: 12 }}
            />
          </View>
        </View>

        <View style={[s.form, { marginRight: issueFormVisible ? 0 : '-100%' }]}>
          <View style={s.formContent}>
            <Text style={[s.titleText, { alignSelf: 'center', marginBottom: 20 }]}>
              Add new Issue
            </Text>
            <Text style={s.guideText}>
              Provide a short description of the discovered issue. Examples may be
              broken parts of the interior, signs of vandalism etc.
            </Text>
            <Text style={[s.guideText, { marginBottom: 20 }]}>
              In case you think the car should not transport passengers, please contact the
              Fleet Manager.
            </Text>
            <TextInput
              style={s.descInput}
              underlineColorAndroid="transparent"
              placeholder="Type short description here ..."
              value={issueDesc}
              onChangeText={text => this.setState({ issueDesc: text })}
              placeholderTextColor="#ffffff"
            />
          </View>
          <View style={s.buttonGroup}>
            <Button
              onPress={this.hideIssueForm}
              title="Cancel"
              containerStyle={s.addIssueButtonContainer}
              textStyle={s.addIssueText}
            />
            <Button
              onPress={this.createIssue}
              title="Add Issue"
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
  caroussel: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
  },
  main: {
    flex: 1,
    backgroundColor: '#000000',
  },
  form: {
    width: '100%',
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  guideText: {
    color: '#ffffff',
    fontSize: 17,
    marginBottom: 10,
  },
  guideTextCleanliness: {
    paddingBottom: 4,
  },
  rating: {
    paddingLeft: 10,
    marginBottom: 20,
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  descInput: {
    borderWidth: 1,
    borderColor: '#ffffff',
    padding: 10,
    borderRadius: 4,
    height: 38,
    color: '#ffffff',
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

export default InteriorCheckScreen;
