// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';
import { Theme } from '@fluentui/react';
import { MessageThreadStyles } from '@azure/communication-react';

export const useChatComponentsStyles = makeStyles({
  container: {
    width: '100%',
    height: 'calc(100vh - 60px)',
    display: 'flex',
    flexDirection: 'column'
  },
  messageThreadContainer: {
    flexGrow: 1,
    maxHeight: 'calc(100vh - 60px)',
    overflowY: 'auto'
  },
  sendBoxContainer: {
    padding: '0.75rem 5rem 1.5rem',
    backgroundColor: tokens.colorNeutralBackground3
  }
});

export const messageThreadStyles = (theme: Theme, isDarkMode: boolean): MessageThreadStyles => {
  return {
    chatContainer: {
      backgroundColor: theme.palette.neutralLighter,
      padding: '0.75rem 3.125rem'
    },
    chatMessageContainer: {
      background: isDarkMode ? theme.palette.neutralLighterAlt : tokens.colorNeutralBackground1
    }
  };
};
