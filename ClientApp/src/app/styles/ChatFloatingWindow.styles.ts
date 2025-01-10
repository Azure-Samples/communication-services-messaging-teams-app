// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { makeStyles, tokens } from '@fluentui/react-components';

export const useChatFloatingWindowStyles = makeStyles({
  floatingWindow: {
    width: '280px',
    height: '404px',
    background: tokens.colorNeutralBackground1,
    boxShadow: '0px 2px 8px 0px #004E8C1A',
    borderTopLeftRadius: '0.5rem', // 8px
    borderTopRightRadius: '0.5rem', // 8px
    position: 'fixed',
    right: '0.75rem', // 12px
    bottom: '0'
  }
});
