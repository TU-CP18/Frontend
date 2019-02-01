import { createStackNavigator } from 'react-navigation';

import ExteriorCheckStartScreen from '../screens/RidePreparation/ExteriorCheck/StartScreen';
import ExteriorCheckFrontSideScreen from '../screens/RidePreparation/ExteriorCheck/FrontSideScreen';
import ExteriorCheckDriverSideScreen from '../screens/RidePreparation/ExteriorCheck/DriverSideScreen';
import ExteriorCheckRearSideScreen from '../screens/RidePreparation/ExteriorCheck/RearSideScreen';
import ExteriorCheckCoDriverSideScreen from '../screens/RidePreparation/ExteriorCheck/CoDriverSideScreen';
import ExteriorCheckFinalConfirmationScreen from '../screens/RidePreparation/ExteriorCheck/FinalConfirmationScreen';
import InteriorCheckScreen from '../screens/RidePreparation/InteriorCheckScreen';
import ContactScreen from '../screens/ContactScreen';
import MapScreen from '../screens/MapScreen';

const RidePreparationNavigator = createStackNavigator(
  {
    ExteriorCheckStart: ExteriorCheckStartScreen,
    ExteriorCheckFrontSide: ExteriorCheckFrontSideScreen,
    ExteriorCheckDriverSide: ExteriorCheckDriverSideScreen,
    ExteriorCheckRearSide: ExteriorCheckRearSideScreen,
    ExteriorCheckCoDriverSide: ExteriorCheckCoDriverSideScreen,
    ExteriorCheckFinalConfirmation: ExteriorCheckFinalConfirmationScreen,
    InteriorCheck: InteriorCheckScreen,
    Contact: ContactScreen,
    Map: MapScreen,
  },
  {
    initialRouteName: 'ExteriorCheckStart',
  },
);

export default RidePreparationNavigator;
