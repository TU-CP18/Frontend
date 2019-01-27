import React from 'react';
import ExteriorCheck from '../../../components/ExteriorCheck';
import { frontContour, frontParts } from '../../../constants/vectors';

const frontSide = require('../../../assets/images/car_models/front_side.jpg');

class ExteriorCheckFrontSideScreen extends React.Component {
  static navigationOptions = props => {
    return ExteriorCheck.getNavigationOptions('Frontside', props);
  };

  onConfirm = () => {
    const { navigation } = this.props;
    navigation.navigate('ExteriorCheckDriverSide');
  }

  render() {
    return (
      <ExteriorCheck
        side="front"
        image={frontSide}
        onConfirm={this.onConfirm}
        contourVector={frontContour}
        parts={frontParts}
      />
    );
  }
}

export default ExteriorCheckFrontSideScreen;
