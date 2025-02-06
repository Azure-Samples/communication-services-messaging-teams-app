// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const inputSectionStyles = makeStyles({
  textFieldContainer: {
    width: '256px'
  },
  textFieldTextStyle: {
    '::-webkit-input-placeholder': {
      fontSize: tokens.fontSizeBase300,
      fontWeight: 400,
      lineHeight: tokens.lineHeightBase300
    },
    '::-moz-placeholder': {
      fontSize: tokens.fontSizeBase300,
      fontWeight: 400,
      lineHeight: tokens.lineHeightBase300
    },
    ':-moz-placeholder': {
      fontSize: tokens.fontSizeBase300,
      fontWeight: 400,
      lineHeight: tokens.lineHeightBase300
    }
  }
});

export const textFieldStyle = {
  padding: '5px 6px'
};
