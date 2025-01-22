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
    margin: '0.375rem' // 6px
  },
  closeButton: {
    width: '2rem', // 32px
    height: '2rem', // 32px
    padding: 0,
    color: tokens.colorNeutralForeground2,
    border: 'none'
  },
  imageContainer: {
    width: '100%',
    height: 'auto',
    padding: '0.25rem 1rem 0' // 4px 16px 0
  },
  heroText: {
    marginTop: '0.75rem', // 12zpx
    fontSize: '1.125rem', // 18px
    fontWeight: 600,
    lineHeight: '1.375rem', // 22px
    textAlign: 'center'
  },
  inputContainer: {
    width: '100%',
    padding: '0 0.75rem', // 0 12px
    marginTop: '1.75rem', // 28px TODO: Check with UX whether we want to reduce this to 8px
    marginBottom: '0.75rem', // 12px
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem' // 12px Add space between children
  },
  startChatButton: {
    width: '256px',
    height: '36px',
    borderRadius: '0.25', // 4px
    fontWeight: 600,
    fontSize: '0.875rem', // 14px
    lineHeight: '1.25rem' // 20px
  }
});
