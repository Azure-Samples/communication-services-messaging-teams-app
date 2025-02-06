// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useThreadListHeaderStyles = makeStyles({
  container: {
    width: '320px',
    height: '60px',
    padding: '0 0.5rem', // 0 8px
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`
  },
  tabList: {
    width: '320px',
    height: '60px'
  }
});
