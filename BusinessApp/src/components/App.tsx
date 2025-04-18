// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  tokens
} from '@fluentui/react-components';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useTeamsUserCredential } from '@microsoft/teamsfx-react';
import Privacy from './Privacy';
import TermsOfUse from './TermsOfUse';
import { Tab } from './Tab';
import { TeamsFxContext } from './Context';
import config from '../lib/config';
import { LoadingSpinner } from './chat/LoadingSpinner';

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export const App = (): JSX.Element => {
  const { loading, theme, themeString, teamsUserCredential } = useTeamsUserCredential({
    initiateLoginEndpoint: config.initiateLoginEndpoint,
    clientId: config.clientId
  });
  return (
    <TeamsFxContext.Provider value={{ theme, themeString, teamsUserCredential }}>
      <FluentProvider
        theme={
          themeString === 'dark'
            ? teamsDarkTheme
            : themeString === 'contrast'
            ? teamsHighContrastTheme
            : teamsLightTheme
        }
        style={{ background: tokens.colorNeutralBackground3 }}
      >
        <Router>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Routes>
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/termsofuse" element={<TermsOfUse />} />
              <Route path="/tab" element={<Tab />} />
              <Route path="*" element={<Navigate to={'/tab'} />}></Route>
            </Routes>
          )}
        </Router>
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
};
