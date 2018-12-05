import { createStackNavigator } from 'react-navigation';

import ExteriorCheckScreen from '../screens/RidePreparation/ExteriorCheckScreen';
import InteriorCheckScreen from '../screens/RidePreparation/InteriorCheckScreen';
import ContactScreen from '../screens/ContactScreen';
import MapScreen from '../screens/MapScreen';

const RidePreparationNavigator = createStackNavigator(
  {
    ExteriorCheck: ExteriorCheckScreen,
    InteriorCheck: InteriorCheckScreen,
    Contact: ContactScreen,
    Map: MapScreen,
  },
  {
    initialRouteName: 'ExteriorCheck',
  },
);

export default RidePreparationNavigator;
