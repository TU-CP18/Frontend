import React from 'react';
import ExteriorCheck from '../../../components/ExteriorCheck';

const frontSide = require('../../../assets/images/car_models/co_driver_side.jpg');

const issues = [];

class ExteriorCheckCoDriverSideScreen extends React.Component {
  static navigationOptions = props => {
    return ExteriorCheck.getNavigationOptions('Co-Driver Side', props);
  };

  onConfirm = () => {
    const { navigation } = this.props;
    navigation.navigate('ExteriorCheckFinalConfirmation');
  }

  render() {
    return (
      <ExteriorCheck
        image={frontSide}
        issues={issues}
        onConfirm={this.onConfirm}
      />
    );
  }
}

export default ExteriorCheckCoDriverSideScreen;
