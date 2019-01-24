import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import Button from './Button';
import IssueMarker from './IssueMarker';
import pointInPolygon from '../helpers/pointInPolygon';

class IssueModal extends React.Component {

  constructor() {
    super();

    this.state = {
      issuePosition: {},
    };
    this.carImage = React.createRef();
  }

  carPolygonModel = [
    [40, 40],
    [200, 40],
    [200, 200],
    [40, 200],
  ];

  measureCarImage = () => new Promise((resolve, reject) => {
    if (!this.carImage) reject();
    this.carImage.measure((fx, fy, width, height, px, py) => {
      resolve({ px, py, width, height });
    });
  })

  setIssuePosition = event => {
    // const {
    //   px,
    //   py,
    //   width,
    //   height,
    // } = await this.measureCarImage();
    //     x: event.nativeEvent.locationX,

    const clickPageX = event.nativeEvent.pageX;
    const clickPageY = event.nativeEvent.pageY;

    // console.log(pointInPolygon([40, 40], this.carPolygonModel));

    this.carImage.current.measure((fx, fy, width, height, px, py) => {
      console.log(width, height);
      const imageX = clickPageX - px;
      const imageY = clickPageY - py;

      if (!pointInPolygon([imageX, imageY], this.carPolygonModel)) {
        console.log("Did not selected car area...");
        return;
      }

      this.setState({
        issuePosition: {
          x: imageX,
          y: imageY,
        },
      });
    });
  }

  render() {
    const {
      visible,
      onHide,
      image,
    } = this.props;
    const { issuePosition } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onHide}
        onShow={this.measureImage}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>
              Record new issue
            </Text>
            <View style={styles.separator} />
            <TouchableWithoutFeedback
              onPress={this.setIssuePosition}
            >
              <View>
                <Image
                  source={image}
                  style={styles.carImage}
                  ref={this.carImage}
                />
                {issuePosition.x && (
                  <IssueMarker
                    x={issuePosition.x}
                    y={issuePosition.y}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
            <Text style={styles.imgSubtitle}>Rear Side</Text>
            <TextInput
              style={styles.descInput}
              underlineColorAndroid="transparent"
              placeholder="Type in here the issue description ..."
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <Button
              title="Cancel"
              transparent
              onPress={() => { console.log("jaja"); /*console.log(this.carImage.current);*/ onHide(); }}
              wrapperStyle={{
                marginRight: 20,
              }}
              containerStyle={{
                paddingLeft: 20,
                paddingRight: 20,
              }}
            />
            <Button
              title="Submit"
              onPress={onHide}
              wrapperStyle={{ flex: 1, }}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    padding: 25,
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 2,
    width: '20%',
    marginTop: 4,
    backgroundColor: '#cecece',
    marginBottom: 10,
  },
  carImage: {
    width: '100%',
    height: 290,
    resizeMode: 'contain',
  },
  descInput: {
    borderWidth: 1,
    borderColor: '#cecece',
    padding: 10,
    borderRadius: 4,
    height: 38,
  },
  imgSubtitle: {
    textAlign: 'center',
    width: '100%',
    marginBottom: 20,
  },
});

export default IssueModal;
