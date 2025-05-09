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
    backgroundColor: tokens.colorNeutralBackground3,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: '0 1.25rem'
  },
  primaryText: {
    fontSize: '1.125rem',
    fontWeight: 700,
    lineHeight: '1.5rem',
    display: 'inline-block', // Ensure the text is treated as a block for truncation
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '30vw'
  },
  resolveButton: {
    width: '6.25rem',
    height: '2rem',
    marginRight: '0.125rem'
  }
});
