import { createStackNavigator } from 'react-navigation';

import InteriorCheckScreen from '../screens/RideCompletion/InteriorCheckScreen';
import ExteriorCheckStartScreen from '../screens/RideCompletion/ExteriorCheck/StartScreen';
import ExteriorCheckFrontSideScreen from '../screens/RideCompletion/ExteriorCheck/FrontSideScreen';
import ExteriorCheckDriverSideScreen from '../screens/RideCompletion/ExteriorCheck/DriverSideScreen';
import ExteriorCheckRearSideScreen from '../screens/RideCompletion/ExteriorCheck/RearSideScreen';
import ExteriorCheckCoDriverSideScreen from '../screens/RideCompletion/ExteriorCheck/CoDriverSideScreen';
import ExteriorCheckFinalConfirmationScreen from '../screens/RideCompletion/ExteriorCheck/FinalConfirmationScreen';
import ContactScreen from '../screens/ContactScreen';

const RideCompletionNavigator = createStackNavigator(
  {
    InteriorCheck: InteriorCheckScreen,
    ExteriorCheckStart: ExteriorCheckStartScreen,
    ExteriorCheckFrontSide: ExteriorCheckFrontSideScreen,
    ExteriorCheckDriverSide: ExteriorCheckDriverSideScreen,
    ExteriorCheckRearSide: ExteriorCheckRearSideScreen,
    ExteriorCheckCoDriverSide: ExteriorCheckCoDriverSideScreen,
    ExteriorCheckFinalConfirmation: ExteriorCheckFinalConfirmationScreen,
    Contact: ContactScreen,
  },
  {
    initialRouteName: 'InteriorCheck',
  },
);

export default RideCompletionNavigator;
