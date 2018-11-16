import { createStackNavigator } from 'react-navigation';

import LoginScreen from '../screens/LoginScreen';
import DevSettingsScreen from '../screens/DevSettingsScreen';

const AuthNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    DevSettings: DevSettingsScreen,
  },
  {
    initialRouteName: 'Login',
    // headerMode: 'none',
  },
);

export default AuthNavigator;
