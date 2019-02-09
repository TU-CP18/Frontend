import { createStackNavigator } from 'react-navigation';

import RideScreen from '../screens/Ride/RideScreen';
import ControlScreen from '../screens/Ride/ControlScreen';
import ContactScreen from '../screens/ContactScreen';
import IncidentScreen from '../screens/IncidentScreen';

const MainStack = createStackNavigator(
  {
    Ride: RideScreen,
    Control: ControlScreen,
    Contact: ContactScreen,
    Incident: IncidentScreen,
  },
  {
    initialRouteName: 'Ride',
  },
);

export default MainStack;
