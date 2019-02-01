import React from 'react';
import ExteriorCheck from '../../../components/ExteriorCheck';
import { driverContour, driverParts } from '../../../constants/vectors';

const frontSide = require('../../../assets/images/car_models/driver_side.jpg');

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
        side="driver"
        image={frontSide}
        onConfirm={this.onConfirm}
        contourVector={driverContour}
        parts={driverParts}
      />
    );
  }
}

export default ExteriorCheckDriverSideScreen;
