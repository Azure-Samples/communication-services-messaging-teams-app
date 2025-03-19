// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useChatScreenStyles = makeStyles({
  chatScreenContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    // TODO: Remove this after switching to components instead of composites
    background: tokens.colorNeutralBackground1
  },
  chatCompositeContainer: {
    flexGrow: 1, // Take the remaining height
    margin: '0 3.44rem', // 55px
    background: 'white'
  }
});
