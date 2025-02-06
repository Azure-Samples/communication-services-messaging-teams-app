// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useThreadListStyles = makeStyles({
  container: {
    width: '320px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: tokens.colorNeutralBackground4,
    boxShadow: '0px 14px 250px 0px #00000024'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    height: '28px',
    marginTop: '0.5rem', // 8px
    padding: '0 1.25rem', // 0 20px
    fontSize: '0.75rem', // 12px
    fontWeight: 400,
    lineHeight: '1rem' // 16px
  },
  threadList: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 0.5rem' // 0 20px
  },
  threadItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '48px',
    padding: '0.625rem' // 10px
  },
  timestamp: {
    padding: '0.25rem' // 4px
  },
  unselectedThreadItem: {
    ':hover': {
      border: `1px solid ${tokens.colorNeutralStroke1Hover}`,
      borderRadius: '4px'
    }
  },
  selectedThreadItem: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '4px'
  }
});
