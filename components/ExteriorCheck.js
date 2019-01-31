import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  Svg,
} from 'expo';
import { observer, inject } from 'mobx-react';
import { reaction } from 'mobx';
import { Entypo } from '@expo/vector-icons';
import Button from './Button';
import AutoHeightImage from './AutoHeightImage';
import IssueMarker from './IssueMarker';
import pointInPolygon from '../helpers/pointInPolygon';

const screenWidth = Dimensions.get('window').width;

@inject('issues', 'alert')
@observer
class ExteriorCheck extends React.Component {
  static getNavigationOptions = title => {
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

  constructor(props) {
    super(props);

    this.carImage = React.createRef();
    this.state = {
      issueFormVisible: false,
      issuePosition: {},
      issueDesc: '',
      scaleFactor: 1,
      imageheight: 300,
    };

    reaction(
      () => props.issues.insertLoading,
      loading => {
        if (!loading && !props.issues.insertError) {
          // when inserting is done and there has been no error
          // switch back to the issue list view
          LayoutAnimation.easeInEaseOut();
          this.setState({
            issueFormVisible: false,
            issueDesc: '',
            issuePosition: {},
          });
        }
      },
    );
  }

  componentDidMount() {
    this.setState({
      scaleFactor: this.scaleFactor,
      imageheight: this.imageheight,
    });
  }

  showIssueForm = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ issueFormVisible: true });
  }

  hideIssueForm = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ issueFormVisible: false });
  }

  /**
   * Given original coordinates, this method translates the
   * provided coordinates according to the scale factor of the images.
   */
  translateToScalledImage = (x, y) => {
    const { scaleFactor } = this.state;
    return {
      x: x * scaleFactor,
      y: y * scaleFactor,
    };
  }

  /**
   * Given coordinates gathered from the scalled images, this method
   * translates them to the respective coordinates in the original image.
   */
  translateFromScalledImage = (x, y) => {
    const { scaleFactor } = this.state;
    return {
      x: x / scaleFactor,
      y: y / scaleFactor,
    };
  }

  setIssuePosition = event => {
    // https://facebook.github.io/react-native/docs/gesture-responder-system

    const clickPageX = event.nativeEvent.pageX;
    const clickPageY = event.nativeEvent.pageY;


    this.carImage.current.measure((_fx, _fy, _width, _height, px, py) => {
      const locX = clickPageX - px;
      const locY = clickPageY - py;

      const { x, y } = this.translateFromScalledImage(locX, locY);

      const { contourVector, parts } = this.props;

      if (!pointInPolygon([x, y], contourVector)) {
        return;
      }

      let selectedPart = 'Frame';
      for (let i = 0; i < parts.length; i += 1) {
        const part = parts[i];
        if (pointInPolygon([x, y], part.vector)) {
          selectedPart = part.name;
          break;
        }
      }

      this.setState({
        issuePosition: {
          x: x,
          y: y,
          scalledX: locX,
          scalledY: locY,
          part: selectedPart,
        },
      });
    });
  }

  createIssue = () => {
    const {
      issues,
      side,
      alert,
    } = this.props;
    const {
      issuePosition,
      issueDesc,
    } = this.state;

    if (!issuePosition.x) {
      alert.show('Marker missing', 'Please select an area in the image');
      return;
    }

    if (!issueDesc) {
      alert.show('Description missing', 'Please provide a description for the issue');
      return;
    }

    issues.addIssue(
      issuePosition.x,
      issuePosition.y,
      `${side}/${issuePosition.part}`,
      issueDesc,
    );
  }

  /**
   * Component that renders the contour of the selected part
   * by converting it's vector which is an array of [x, y] values
   * to an SVG path command.
   */
  RenderPart = ({ selectedPart, parts, width, height }) => {
    if (selectedPart === 'Frame') return null;

    const part = parts.find(part => part.name === selectedPart);
    if (!part) return null;

    // create path command
    // M x y sets the start poinrt
    // L x y draws a line fron the current position to the specified position
    // Z draws a line to the start position M
    // use uppercase letter for absolute units/coordinates
    // possible enhancements: curves (https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)

    // set the initial point
    const startPos = this.translateToScalledImage(
      part.vector[0][0],
      part.vector[0][1],
    );
    let path = `M ${startPos.x} ${startPos.y}`;

    for (let i = 1; i < part.vector.length; i += 1) {
      // draw next line
      const nextPos = this.translateToScalledImage(
        part.vector[i][0],
        part.vector[i][1],
      );
      path += ` L ${nextPos.x} ${nextPos.y}`;
    }

    // finally add Z to close the path
    path += ' Z';

    return (
      <Svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          borderWidth: 1,
        }}
      >
        <Svg.Path
          d={path}
          fill="none"
          stroke="#A0AAF1"
          strokeWidth={2}
        />
      </Svg>
    );
  }

  render() {
    const {
      issues,
      image,
      onConfirm,
      parts,
      side,
    } = this.props;

    const {
      issueFormVisible,
      issuePosition,
      issueDesc,
      imageheight,
    } = this.state;

    // filter issues by side
    const issueList = issues.issues.slice().filter(issue => {
      return issue.part.startsWith(side);
    }).map(issue => {
      const part = issue.part.split('/')[1];
      return {
        ...issue,
        shortDescription: `${part} - ${issue.description}`,
      };
    });

    if (issues.insertLoading) {
      // TODO: hover above other UI and create common component
      return (
        <View style={s.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#ffffff"
          />
        </View>
      );
    }

    return (
      <View style={s.container}>
        <TouchableWithoutFeedback
          onPress={this.setIssuePosition}
          style={{ marginTop: 10 }}
          disabled={!issueFormVisible}
        >
          <View>
            <AutoHeightImage
              source={image}
              width="100%"
              resizeMode="contain"
              refCallback={this.carImage}
              scaleFactorCallback={scaleFactor => {
                this.scaleFactor = scaleFactor;
              }}
              heightCallback={imageHeight => {
                this.imageheight = imageHeight;
              }}
            />
            {issueList && !issueFormVisible && issueList.map((issue, index) => {
              const { x, y } = this.translateToScalledImage(issue.posX, issue.posY);
              return (
                <IssueMarker
                  key={issue.id}
                  x={x}
                  y={y}
                  number={index + 1}
                  // style={{ opacity: issueFormVisible ? 0 : 1 }}
                />
              );
            })}
            {issuePosition.scalledX && issueFormVisible && (
              <IssueMarker
                x={issuePosition.scalledX}
                y={issuePosition.scalledY}
              />
            )}
            {issuePosition.scalledX && issueFormVisible && (
              <this.RenderPart
                selectedPart={issuePosition.part}
                parts={parts}
                width={screenWidth}
                height={imageheight}
              />
            )}
          </View>
        </TouchableWithoutFeedback>

        <View style={s.caroussel}>
          <View style={[s.main, { marginLeft: issueFormVisible ? '-100%' : 0 }]}>
            <View style={s.issueList}>
              <View style={{ alignItems: 'center', }}>
                <Text style={{ color: '#ffffff', fontSize: 22, }}>
                  Tracked Issues
                </Text>
              </View>
              {issueList.length === 0 && (
                <Text style={s.noIssuesInfo}>
                  There are currently no issue tracked
                </Text>
              ) || (
                <ScrollView style={s.issueScrollView}>
                  {issueList.map((issue, index) => {
                    return (
                      <View key={index} style={s.issueItem}>
                        <View style={s.issueNumber}>
                          <Text textAlign="center">
                            {index + 1}
                          </Text>
                        </View>
                        <Text
                          style={s.issueDescription}
                          numberOfLines={3}
                        >
                          {issue.shortDescription}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              )}
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
                onPress={onConfirm}
                title="Confirm"
                wrapperStyle={s.confirmButtonWrapper}
                containerStyle={s.confirmButtonContainer}
              />
            </View>
          </View>

          <View style={[s.form, { marginRight: issueFormVisible ? 0 : '-100%' }]}>
            <View style={s.formContent}>
              <Text style={s.formTitle}>
                Add new Issue
              </Text>
              <Text style={{ color: '#ffffff', marginBottom: 20, fontSize: 16, }}>
                Please marke the position of the discovered issue on the image and
                enter a short description.
              </Text>
              <Text style={{ color: '#ffffff', marginBottom: 10, }}>
                Selected Part: {issuePosition.part || '-'}
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
      </View>
    );
  }
}

const s = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  caroussel: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
  },
  main: {
    flex: 1,
  },
  issueList: {
    flex: 1,
    width: '100%',
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  issueScrollView: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  issueNumber: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
  },
  issueDescription: {
    color: '#ffffff',
    marginLeft: 20,
    fontSize: 16,
    marginRight: 20,
  },
  noIssuesInfo: {
    color: '#ffffff',
    alignSelf: 'center',
    fontSize: 16,
    marginTop: 40,
  },

  form: {
    width: '100%',
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formTitle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 20,
    marginBottom: 20,
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

ExteriorCheck.propTypes = {
  contourVector: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.number),
  ).isRequired,
  parts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      vector: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.number),
      ),
    }),
  ).isRequired,
  image: PropTypes.number.isRequired,
  onConfirm: PropTypes.func,
};

ExteriorCheck.defaultProps = {
  onConfirm: () => {},
};

export default ExteriorCheck;
