// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useContext } from 'react';
import { AgentScreen } from './chat/AgentScreen';
import { TeamsFxContext } from './Context';

export const Tab = (): JSX.Element => {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <div className={themeString === 'default' ? 'light' : themeString === 'dark' ? 'dark' : 'contrast'}>
      <AgentScreen />
    </div>
  );
};
