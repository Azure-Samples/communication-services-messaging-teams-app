// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { mergeStyles } from '@fluentui/react';

export const floatingWindowStyle = mergeStyles({
  width: '16.6875rem', // 267px
  height: '24.5625rem', // 393px
  backgroundColor: 'blue', // TODO: Remove this line when the content view is added
  boxShadow: '0px 2px 8px 0px #004E8C1A',
  borderTopLeftRadius: '0.5rem', // 8px
  borderTopRightRadius: '0.5rem', // 8px
  position: 'fixed',
  right: '0.75rem', // 12px
  bottom: '0'
});
