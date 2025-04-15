// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { setLogLevel } from '@azure/logger';
import { useState } from 'react';
import { GetLiveHelpButton } from './GetLiveHelpButton';
import { ChatFloatingWindow } from './ChatFloatingWindow';
import { useAppStyles } from './styles/App.styles';
import { Label } from '@fluentui/react-components';
import { strings } from './utils/constants';

setLogLevel('error');

export const App = (): JSX.Element => {
  const styles = useAppStyles();
  const [isChatFloatingWindowOpen, setIsChatFloatingWindowOpen] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.welcomeContainer}>
        <Label className={styles.welcomeTitle}>{strings.welcomeTitle}</Label>
        <Label className={styles.welcomeMessage}>{strings.welcomeMessage}</Label>
        <Label className={styles.welcomeMessage}>{strings.welcomeDirectionMessage}</Label>
      </div>
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
