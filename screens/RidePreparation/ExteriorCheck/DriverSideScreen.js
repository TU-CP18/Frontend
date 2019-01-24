import React from 'react';
import ExteriorCheck from '../../../components/ExteriorCheck';

const frontSide = require('../../../assets/images/car_models/driver_side.jpg');

const issues = [
  {
    x: 300,
    y: 300,
    desc: 'Fahrertür - Delle',
  },
];

class ExteriorCheckDriverSideScreen extends React.Component {
  static navigationOptions = props => {
    return ExteriorCheck.getNavigationOptions('Driverside', props);
  };

  onConfirm = () => {
    const { navigation } = this.props;
    navigation.navigate('ExteriorCheckRearSide');
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

export default ExteriorCheckDriverSideScreen;
