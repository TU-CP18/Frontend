import { createStackNavigator } from 'react-navigation';

import RideCompletionScreen from '../screens/RideCompletionScreen';

const MainStack = createStackNavigator(
  {
    RideCompletion: RideCompletionScreen,
  },
  {
    initialRouteName: 'RideCompletion',
  },
);

export default MainStack;
