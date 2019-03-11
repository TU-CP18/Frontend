import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  ScrollView,
  LayoutAnimation,
  Image,
  Dimensions,
} from 'react-native';
import { observer, inject, disposeOnUnmount } from 'mobx-react';
import { reaction } from 'mobx';
import { Entypo } from '@expo/vector-icons';
import Rating from '../../components/Rating';
import Button from '../../components/Button';

const unlockGif = require('../../assets/images/unlock.gif');

const screenHeight = Dimensions.get('window').height;

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
      showCarUnlocked: true,
      showCarUnlockedMessage: false,
    };
  }

  componentDidMount() {
    const { issues } = this.props;

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

    // dispose reaction when unmounting this component
    disposeOnUnmount(this, insertReaction);

    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      this.setState({ showCarUnlockedMessage: true });
    }, 1500);
    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      this.setState({ showCarUnlocked: false });
    }, 4500);
  }

  onPressStartRide = () => {
    const {
      navigation,
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
      'Confirm that you checked the operional readiness of the car '
      + 'accordingly and that you ready for the ride.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            await currentShift.finishRidePreparation(rating);
            navigation.navigate('Ride');
          },
        },
      ],
      { cancelable: true },
    );
  }

  showIssueForm = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      issueFormVisible: true,
    });
  }

  hideIssueForm = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      issueFormVisible: false,
    });
  }

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
      showCarUnlocked,
      showCarUnlockedMessage,
    } = this.state;

    const issueList = issues.issues.slice().filter(issue => {
      return issue.part.startsWith('interior');
    });

    return (
      <View style={{ flex: 1, }}>
        <View style={s.caroussel}>
          <View style={[s.main, { marginLeft: issueFormVisible ? '-100%' : 0 }]}>
            <View style={s.content}>
              <Text style={[s.guideText, { marginTop: 10 }]}>
                Before you can start the ride, please track new issues of the interior and
                confirm that the car is operational.
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
                titleStyle={s.addIssueText}
              />
              <Button
                onPress={this.onPressStartRide}
                title="Start Ride"
                wrapperStyle={s.confirmButtonWrapper}
                containerStyle={s.confirmButtonContainer}
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
                titleStyle={s.addIssueText}
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

        <View
          style={[
            s.unlockedCover,
            { marginTop: showCarUnlocked ? 0 : -screenHeight },
          ]}
        >
          <Image
            source={unlockGif}
          />
          {showCarUnlockedMessage && (
            <View style={{ marginTop: -160 }}>
              <Text style={s.unlockTitle}>Doors Unlocked</Text>
              <Text style={s.unlockSubtitle}>Please enter the car</Text>
            </View>
          )}
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

  unlockedCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  unlockTitle: {
    color: '#ffffff',
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
  },
  unlockSubtitle: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
  },
});

export default InteriorCheckScreen;
