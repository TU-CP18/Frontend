import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';

// You could add another route here for authentication.
// Read more at https://reactnavigation.org/docs/en/auth-flow.html

export default ({ initialRoute = 'Auth' }) => {
  const AppNavigator = createSwitchNavigator(
    {
      Main: MainNavigator,
      Auth: AuthNavigator,
    },
    {
      initialRouteName: initialRoute,
      headerMode: 'none',
    }
  );

  return <AppNavigator />
};