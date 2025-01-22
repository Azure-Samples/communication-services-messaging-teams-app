// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { setLogLevel } from '@azure/logger';
import { useState } from 'react';
import { GetLiveHelpButton } from './GetLiveHelpButton';
import { ChatFloatingWindow } from './ChatFloatingWindow';
import { useAppStyles } from './styles/App.styles';

setLogLevel('error');

export const App = (): JSX.Element => {
  const styles = useAppStyles();
  const [isChatFloatingWindowOpen, setIsChatFloatingWindowOpen] = useState(false);

  return (
    <div className={styles.root}>
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
    </div>
  );
};
