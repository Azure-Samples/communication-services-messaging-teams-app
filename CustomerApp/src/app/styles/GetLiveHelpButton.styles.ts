// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const useGetLiveHelpButtonStyles = makeStyles({
  button: {
    fontWeight: 600,
    lineHeight: '1.375rem',
    letterSpacing: '-0.06em',
    boxShadow: '0px 2px 21px 0px #003C6A33',
    border: 'none',
    borderRadius: '1.125rem',
    position: 'fixed',
    right: '0.5625rem',
    bottom: '0.75rem',
    color: tokens.colorCompoundBrandForeground1Pressed,
    ':hover': {
      color: tokens.colorCompoundBrandForeground1Hover
    }
  }
});
