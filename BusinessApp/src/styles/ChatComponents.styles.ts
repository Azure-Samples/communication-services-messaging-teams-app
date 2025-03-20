// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useChatComponentsStyles = makeStyles({
  container: {
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: tokens.colorNeutralBackground1Hover
  },
  messageThreadContainer: {
    overflow: 'auto',
    flexGrow: 1
  },
  sendBoxContainer: {
    margin: '0.5rem 5rem 1.5rem'
  }
});

export const messageThreadStyles = {
  chatContainer: {
    backgroundColor: tokens.colorNeutralBackground1Hover,
    padding: '0.75rem 3.125rem 0'
  }
};
