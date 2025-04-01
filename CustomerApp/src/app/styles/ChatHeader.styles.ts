// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useChatHeaderStyles = makeStyles({
  chatHeaderContainer: {
    width: '100%',
    height: '44px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`
  },
  personaContainer: {
    marginLeft: '0.75rem'
  },
  headerTitle: {
    fontSize: '1.25rem',
    fontWeight: 600
  },
  closeButton: {
    color: tokens.colorNeutralForeground1,
    width: '2rem',
    height: '2rem',
    marginRight: '0.125rem',
    border: 'none'
  }
});
