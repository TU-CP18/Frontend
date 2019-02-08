import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import RidePreparationNavigator from './RidePreparationNavigator';
import RideNavigator from './RideNavigator';
import RideCompletionNavigator from './RideCompletionNavigator';
import IncidentScreen from '../screens/IncidentScreen';

// You could add another route here for authentication.
// Read more at https://reactnavigation.org/docs/en/auth-flow.html

export default ({ initialRoute = 'Auth' }) => {
  const AppNavigator = createSwitchNavigator(
    {
      Main: MainNavigator,
      Auth: AuthNavigator,
      RidePreparation: RidePreparationNavigator,
      Ride: RideNavigator,
      RideCompletion: RideCompletionNavigator,
      Incident: IncidentScreen,
    },
    {
      initialRouteName: initialRoute,
      // headerMode: 'none',
    },
  );

  return <AppNavigator />;
};
