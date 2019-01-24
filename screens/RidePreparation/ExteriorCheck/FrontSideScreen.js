import React from 'react';
import ExteriorCheck from '../../../components/ExteriorCheck';

const frontSide = require('../../../assets/images/car_models/front_side.jpg');

const issues = [
  {
    x: 300,
    y: 300,
    desc: 'Windshield - Steinschlag',
  },
  {
    x: 340,
    y: 340,
    desc: 'Left light - Riss im Glas',
  },
  {
    x: 400,
    y: 400,
    desc: 'Motorhaube - Große Delle',
  },
];

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
        image={frontSide}
        issues={issues}
        onConfirm={this.onConfirm}
      />
    );
  }
}

export default ExteriorCheckFrontSideScreen;
