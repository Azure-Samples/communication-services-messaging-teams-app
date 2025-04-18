// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { makeStyles, tokens } from '@fluentui/react-components';

export const useChatFloatingWindowStyles = makeStyles({
  floatingWindow: {
    width: '280px',
    height: 'auto',
    background: tokens.colorNeutralBackground1,
    boxShadow: '0px 2px 8px 0px #004E8C1A',
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    position: 'fixed',
    right: '0.75rem',
    bottom: '0'
  }
});
