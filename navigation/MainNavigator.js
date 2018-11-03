import { createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';

const MainStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  }
);

export default MainStack;