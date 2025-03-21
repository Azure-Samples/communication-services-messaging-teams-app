// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles } from '@fluentui/react-components';

export const useChatScreenStyles = makeStyles({
  chatScreenContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '404px',
    width: '100%'
  },
  chatCompositeContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1, // Take the remaining height
    justifyContent: 'center',
    alignItems: 'stretch'
  }
});
