// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles } from '@fluentui/react-components';

export const useChatComponentsStyles = makeStyles({
  container: {
    width: '100%',
    height: 'calc(404px - 44px)', // Minus header height
    display: 'flex',
    flexDirection: 'column'
  },
  messageThreadContainer: {
    flexGrow: 1,
    overflowY: 'auto'
  },
  sendBoxContainer: {
    padding: '0.75rem'
  },
  resolveSystemMessageContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  resolveSystemMessage: {
    fontWeight: 400,
    fontSize: '0.75rem', // 12px
    letterSpacing: '0'
  }
});

export const messageThreadStyles = {
  chatContainer: {
    padding: '0 0.75rem',
    width: 'calc(100% - 1.5rem)' // Minus padding on both sides
  }
};
