// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { makeStyles, tokens } from '@fluentui/react-components';

export const useAppStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    background: tokens.colorBrandBackgroundInvertedHover
  },
  welcomeContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    background: tokens.colorBrandBackgroundInvertedHover
  },
  welcomeTitle: {
    fontWeight: 600,
    fontSize: '1.375rem',
    marginBottom: '1.5rem'
  },
  welcomeMessage: {
    fontWeight: 600,
    fontSize: '1.125rem',
    marginBottom: '0.25rem'
  }
});
