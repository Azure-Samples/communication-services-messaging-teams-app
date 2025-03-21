// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

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
    padding: '0.75rem 5rem 1.5rem'
  }
});

export const messageThreadStyles = {
  chatContainer: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '0.75rem 3.125rem'
  },
  chatMessageContainer: {
    background: tokens.colorNeutralBackground1
  }
};
