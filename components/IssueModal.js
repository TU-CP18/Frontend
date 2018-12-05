import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import Button from './Button';
import IssueMarker from './IssueMarker';

const carImage = require('../assets/images/car_rear.png');

class IssueModal extends React.Component {

  constructor() {
    super();

    this.state = {
      issuePosition: {},
    };
  }

  setIssuePosition = event => {
    this.setState({
      issuePosition: {
        x: event.nativeEvent.locationX,
        y: event.nativeEvent.locationY,
      },
    });
  }

  render() {
    const {
      visible,
      onHide,
    } = this.props;
    const { issuePosition } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onHide}
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
                  source={carImage}
                  style={styles.carImage}
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
              onPress={onHide}
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
    padding: 20,
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
