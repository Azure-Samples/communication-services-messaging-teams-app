// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { setLogLevel } from '@azure/logger';
import { initializeIcons } from '@fluentui/react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import { useState } from 'react';
import { GetLiveHelpButton } from './GetLiveHelpButton';
import { ChatFloatingWindow } from './ChatFloatingWindow';

setLogLevel('error');

initializeIcons();
initializeFileTypeIcons();

export const App = (): JSX.Element => {
  const [isChatFloatingWindowOpen, setIsChatFloatingWindowOpen] = useState(false);

  return (
    <>
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
    </>
  );
};
