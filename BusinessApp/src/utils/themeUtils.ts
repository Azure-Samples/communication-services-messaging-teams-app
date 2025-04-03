// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { darkTheme } from '@azure/communication-react';

/**
 * Creates a v9 theme from a v8 theme and base v9 theme.
 * FluentUI webLightTheme is used in case if no baseThemeV9 is provided.
 *
 * @private
 */
// TODO
export const v8DarkTheme = {
  ...darkTheme,
  palette: { ...darkTheme.palette, neutralLighter: '#1f1f1f' }
};
