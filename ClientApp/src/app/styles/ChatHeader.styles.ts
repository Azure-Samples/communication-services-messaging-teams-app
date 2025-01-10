// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

export const useChatHeaderStyles = makeStyles({
  chatHeaderContainer: {
    width: '100%',
    height: '2.75rem', // 44px
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke3)
  },
  personaContainer: {
    marginLeft: '0.75rem' // 12px
  },
  headerTitle: {
    fontSize: '1.25rem',
    fontWeight: 600
  },
  closeButton: {
    color: tokens.colorNeutralForeground1,
    width: '2rem', // 32px
    height: '2rem', // 32px
    marginRight: '0.125rem', // 2px
    border: 'none'
  }
});
