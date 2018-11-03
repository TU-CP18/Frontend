import { createStackNavigator } from 'react-navigation';

import LoginScreen from '../screens/LoginScreen';

const AuthNavigator = createStackNavigator(
  {
    Login: LoginScreen,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  }
);

export default AuthNavigator;