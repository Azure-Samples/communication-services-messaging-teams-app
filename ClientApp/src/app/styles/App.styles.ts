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
    background: tokens.colorNeutralBackground1Hover
  }
});
