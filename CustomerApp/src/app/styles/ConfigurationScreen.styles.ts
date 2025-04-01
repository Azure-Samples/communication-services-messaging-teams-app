// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles, tokens } from '@fluentui/react-components';

export const configurationScreenStyles = makeStyles({
  responsiveLayout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0'
  },
  closeButtonContainer: {
    alignSelf: 'flex-end',
    margin: '0.375rem'
  },
  closeButton: {
    width: '2rem',
    height: '2rem',
    padding: 0,
    color: tokens.colorNeutralForeground2,
    border: 'none'
  },
  imageContainer: {
    width: '100%',
    height: '73px',
    padding: '0.25rem 1rem 0'
  },
  heroText: {
    marginTop: '0.75rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: '1.375rem',
    textAlign: 'center'
  },
  inputContainer: {
    width: '100%',
    padding: '0 0.75rem',
    marginTop: '1.75rem',
    marginBottom: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem'
  },
  startChatButton: {
    width: '256px',
    height: '36px',
    borderRadius: '0.25',
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: '1.25rem'
  }
});
