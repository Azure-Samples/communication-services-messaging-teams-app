// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useErrorScreenStyles = makeStyles({
  errorScreenContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground3
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem', // 4px
    width: '100%',
    height: '100%'
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
  }
});
