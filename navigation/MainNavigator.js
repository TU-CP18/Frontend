import { createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import ContactScreen from '../screens/ContactScreen';
import MapScreen from '../screens/MapScreen';
import NextShiftMapScreen from '../screens/NextShiftMapScreen';
import SettingsScreen from '../screens/SettingsScreen';

const MainStack = createStackNavigator(
  {
    Home: HomeScreen,
    Schedule: ScheduleScreen,
    Contact: ContactScreen,
    Map: MapScreen,
    NextShiftMap: NextShiftMapScreen,
    Settings: SettingsScreen,
  },
  {
    initialRouteName: 'Home',
    // headerMode: 'none',
  },
);

export default MainStack;
