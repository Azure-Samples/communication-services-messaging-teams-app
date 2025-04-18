// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useAgentScreenStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    width: '100%'
  },
  chatContainer: {
    width: '100%',
    background: tokens.colorNeutralBackground3,
    boxShadow: `0px 0px 8px 0px ${tokens.colorNeutralShadowAmbient}`
  }
});
