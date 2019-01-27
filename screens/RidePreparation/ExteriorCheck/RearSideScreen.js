import React from 'react';
import ExteriorCheck from '../../../components/ExteriorCheck';
import { rearContour, rearParts } from '../../../constants/vectors';

const frontSide = require('../../../assets/images/car_models/rear_side.jpg');

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
        side="rear"
        image={frontSide}
        onConfirm={this.onConfirm}
        contourVector={rearContour}
        parts={rearParts}
      />
    );
  }
}

export default ExteriorCheckRearSideScreen;
