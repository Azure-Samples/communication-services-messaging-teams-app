// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useEndConfirmationScreenStyles = makeStyles({
  errorScreenContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '404px',
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground1
  },
  closeButtonContainer: {
    alignSelf: 'flex-end',
    margin: '0.375rem' // 6px
  },
  closeButton: {
    width: '2rem', // 32px
    height: '2rem', // 32px
    padding: 0,
    color: tokens.colorNeutralForeground2,
    border: 'none'
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
  errorIcon: {
    color: tokens.colorNeutralStroke1Pressed,
    marginBottom: '0.375rem' // 6px
  },
  errorTitle: {
    fontSize: '1.125rem', // 18px
    fontWeight: 600,
    lineHeight: '1.375rem' // 22px
  },
  errorMessage: {
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
