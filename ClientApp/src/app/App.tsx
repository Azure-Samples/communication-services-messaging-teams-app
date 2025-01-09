// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { setLogLevel } from '@azure/logger';
import { useState } from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { GetLiveHelpButton } from './GetLiveHelpButton';
import { ChatFloatingWindow } from './ChatFloatingWindow';

setLogLevel('error');

export const App = (): JSX.Element => {
  const [isChatFloatingWindowOpen, setIsChatFloatingWindowOpen] = useState(false);

  return (
    <FluentProvider theme={webLightTheme}>
      {isChatFloatingWindowOpen ? (
        <ChatFloatingWindow
          onCloseButtonClick={() => {
            setIsChatFloatingWindowOpen(false);
          }}
        />
      ) : (
        <GetLiveHelpButton
          onGetLiveHelpButtonClick={() => {
            setIsChatFloatingWindowOpen(true);
          }}
        />
      )}
    </FluentProvider>
  );
};
