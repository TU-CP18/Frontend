import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Button from '../../../components/Button';
import AutoHeightImage from '../../../components/AutoHeightImage';
import LoadingIndicator from '../../../components/LoadingIndicator';

const markerImg = require('../../../assets/images/marker.png');

@inject('issues')
@observer
class ExteriorCheckScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Exterior Inspection',
      headerStyle: {
        backgroundColor: '#000000',
        elevation: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: '#ffffff',
    };
  };

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { issues } = this.props;
    issues.fetch();
  }

  RuleItem = ({ id, text, showMoreLink, showMoreText, icon }) => (
    <View style={s.ruleItem}>
      <View style={s.ruleIconColumn}>
        {typeof icon === 'string' ? <FontAwesome name={icon} size={42} color="#ffffff" /> : icon}
      </View>
      <View style={s.ruleContentColumn}>
        <Text style={s.guideText}>
          {text}
        </Text>
        {showMoreLink && (
          <TouchableOpacity onPress={() => {
            this.setState({
              [id]: !this.state[id],
            });
          }}>
            <Text style={[s.guideText, s.linkText]}>
              {showMoreLink}
            </Text>
          </TouchableOpacity>
        )}
        {this.state[id] && (
          <Text style={[s.guideText, { marginTop: 4, }]}>
            {showMoreText}
          </Text>
        )}
      </View>
    </View>
  );

  render() {
    const {
      navigation,
      issues,
    } = this.props;

    if (issues.fetchLoading) {
      return (<LoadingIndicator />);
    }

    return (
      <View style={s.container}>
        <View style={{ flex: 1 }}>
          <View style={{ marginBottom: 10 }}>
            <Text style={s.guideText}>
              Before you can open the car and start the ride, you have to inspect the exterior
              of the car. To start, click the button on the bottom.
            </Text>
            <Text style={s.guideText}>
              Please follow the following rules during the inspection:
            </Text>
          </View>

          <this.RuleItem
            id="minor"
            text="Track minor issues by marking the position and providing a short description."
            showMoreLink="What are minor issues?"
            showMoreText="Some description for minor issue. This also add a whole new screen with
                          example containing images"
            icon={(
              <AutoHeightImage
                source={markerImg}
                width={40}
              />
            )}
          />

          <this.RuleItem
            id="major"
            text="On bigger issues, which impair the operational readiness of the car, please
            contact the Fleet manager immediately."
            showMoreLink="What are major issues?"
            showMoreText="Some description for major issue. This also add a whole new screen with
                          example containing images"
            icon="phone"
          />

          <this.RuleItem
            text="After the inspection you have to rate the cleanliness of the car.
            Please keep an eye on how dirty the car is."
            icon={(
              <MaterialIcons
                name="local-car-wash"
                size={42}
                color="#ffffff"
              />
            )}
          />
        </View>

        <Button
          title="Start Inspection"
          containerStyle={{ marginBottom: 20, padding: 16 }}
          onPress={() => navigation.navigate('ExteriorCheckFrontSide')}
        />
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  guideText: {
    color: '#ffffff',
    fontSize: 17,
    marginBottom: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  ruleIconColumn: {
    flex: 1,
    alignItems: 'center',
  },
  ruleContentColumn: {
    flex: 4,
  },
  linkText: {
    marginTop: 6,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#ffffff',
  },
});

export default ExteriorCheckScreen;
