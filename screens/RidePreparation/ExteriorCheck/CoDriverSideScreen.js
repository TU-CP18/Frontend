import React from 'react';
import ExteriorCheck from '../../../components/ExteriorCheck';
import { coDriverContour, coDriverParts } from '../../../constants/vectors';

const frontSide = require('../../../assets/images/car_models/co_driver_side.jpg');

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
        side="coDriver"
        image={frontSide}
        onConfirm={this.onConfirm}
        contourVector={coDriverContour}
        parts={coDriverParts}
      />
    );
  }
}

export default ExteriorCheckCoDriverSideScreen;
