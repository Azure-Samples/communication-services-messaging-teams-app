// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useEndConfirmationScreenStyles = makeStyles({
  endChatContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '404px',
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground1
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem', // 4px
    width: '100%',
    height: '319px'
  },
  endChatTitle: {
    fontSize: '1.125rem', // 18px
    fontWeight: 600,
    lineHeight: '1.375rem' // 22px
  },
  endChatDescription: {
    fontSize: '0.875rem', // 14px
    fontWeight: 400,
    lineHeight: '18.62px'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '0.5rem', // 8px
    marginBottom: '0.75rem' // 12px
  },
  button: {
    height: '32px',
    margin: '0 0.75rem' // 0 12px
  }
});
