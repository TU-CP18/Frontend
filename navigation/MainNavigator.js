import { createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import ContactScreen from '../screens/ContactScreen';
import MapScreen from '../screens/MapScreen';
import DepartureScreen from '../screens/DepartureScreen';

const MainStack = createStackNavigator(
  {
    Home: HomeScreen,
    Schedule: ScheduleScreen,
    Contact: ContactScreen,
    Map: MapScreen,
    Departure: DepartureScreen,
  },
  {
    initialRouteName: 'Home',
    // headerMode: 'none',
  },
);

export default MainStack;
