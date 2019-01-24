import React from 'react';
import ExteriorCheck from '../../../components/ExteriorCheck';

const frontSide = require('../../../assets/images/car_models/rear_side.jpg');

const issues = [];

class ExteriorCheckRearSideScreen extends React.Component {
  static navigationOptions = props => {
    return ExteriorCheck.getNavigationOptions('Rearside', props);
  };

  onConfirm = () => {
    const { navigation } = this.props;
    navigation.navigate('ExteriorCheckCoDriverSide');
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

export default ExteriorCheckRearSideScreen;
