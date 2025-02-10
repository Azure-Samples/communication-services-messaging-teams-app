// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles } from '@fluentui/react-components';

export const useChatScreenStyles = makeStyles({
  chatScreenContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%'
  },
  chatCompositeContainer: {
    flexGrow: 1, // Take the remaining height
    width: '100%'
  }
});
