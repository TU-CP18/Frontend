import React from 'react';
import {
  StyleSheet,
  View,
  Button,
} from 'react-native';

class ExteriorCheckScreen extends React.Component {
  static navigationOptions = {
    title: 'Exterior Check',
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Button
          onPress={() => navigation.navigate('InteriorCheck')}
          title="InteriorCheck"
          color="blue"
        />
        <Button
          onPress={() => navigation.navigate('Contact')}
          title="Contact"
          color="blue"
        />
        <Button
          onPress={() => navigation.navigate('Map', {
            disableArrivalButton: true,
          })}
          title="Map"
          color="blue"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ExteriorCheckScreen;
