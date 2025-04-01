// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useThreadListHeaderStyles = makeStyles({
  container: {
    width: '320px',
    height: '60px',
    padding: '0 0.5rem',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`
  },
  tabList: {
    width: '100%',
    height: '60px'
  }
});
