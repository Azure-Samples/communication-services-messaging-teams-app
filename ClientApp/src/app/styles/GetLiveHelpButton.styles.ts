// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, mergeStyles } from '@fluentui/react';

export const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem', // 14px
  lineHeight: '1.375rem', // 22px
  letterSpacing: '-0.06em', // 0.01px
  width: '8.813rem', // 141px
  height: '2.375rem', // 38px
  boxShadow: '0px 2px 21px 0px #003C6A33',
  border: 'none',
  borderRadius: '1.125rem', // 18px
  position: 'fixed',
  right: '0.5625rem', // 9px
  bottom: '0.75rem' // 12px
});

export const buttonWithIconStyles: IButtonStyles = {
  textContainer: {
    display: 'contents'
  }
};

export const chatIconStyle = mergeStyles({
  fontSize: '1.25rem' // 20px
});
