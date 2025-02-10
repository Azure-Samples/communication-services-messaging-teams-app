// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useChatHeaderStyles = makeStyles({
  chatHeaderContainer: {
    width: '100%',
    height: '60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
    padding: '0 1.25rem' // 0 8px
  },
  primaryText: {
    fontSize: '1.125rem', // 18px
    fontWeight: 700,
    lineHeight: '1.5rem' // 24px
  },
  closeButton: {
    width: '6.25rem', // 100px
    height: '2rem', // 32px
    marginRight: '0.125rem' // 2px
  }
});
