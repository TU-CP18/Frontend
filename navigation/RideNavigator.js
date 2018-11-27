import { createStackNavigator } from 'react-navigation';

import RideScreen from '../screens/Ride/RideScreen';
import ControlScreen from '../screens/Ride/ControlScreen';
import ContactScreen from '../screens/ContactScreen';

const MainStack = createStackNavigator(
  {
    Ride: RideScreen,
    Control: ControlScreen,
    Contact: ContactScreen,
  },
  {
    initialRouteName: 'Ride',
  },
);

export default MainStack;
