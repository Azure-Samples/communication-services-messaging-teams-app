// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useThreadListStyles = makeStyles({
  container: {
    width: '320px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: tokens.colorNeutralBackground4
  },
  assignedToMeLabel: {
    display: 'flex',
    alignItems: 'center',
    height: '28px',
    marginTop: '0.5rem', // 8px
    padding: '0 1.25rem', // 0 20px
    fontSize: '0.75rem', // 12px
    fontWeight: 400,
    lineHeight: '1rem' // 16px
  },
  noThreadsLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1.375rem', // 22px
    color: tokens.colorNeutralStrokeAccessible,
    fontSize: '0.875rem', // 14px
    fontWeight: 400,
    lineHeight: '1.25rem', // 20px
    letterSpacing: '0px'
  },
  threadList: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 0.5rem' // 0 20px
  },
  personaName: {
    display: 'inline-block', // Ensure the text is treated as a block for truncation
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '150px'
  },
  threadItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '48px',
    width: '100%',
    padding: '0.625rem' // 10px
  },
  timestamp: {
    padding: '0.25rem' // 4px
  },
  unselectedThreadItem: {
    boxSizing: 'border-box',
    border: `1px solid transparent`,
    ':hover': {
      boxSizing: 'border-box',
      border: `1px solid ${tokens.colorNeutralStroke1Hover}`,
      borderRadius: '4px'
    }
  },
  selectedThreadItem: {
    boxSizing: 'border-box',
    backgroundColor: tokens.colorNeutralBackground1Selected,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '4px'
  }
});
