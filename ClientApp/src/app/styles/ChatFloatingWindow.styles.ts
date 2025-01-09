// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { makeStyles } from '@fluentui/react-components';

export const chatFloatingWindowStyles = makeStyles({
  floatingWindow: {
    width: '267px',
    height: '393px',
    backgroundColor: 'blue', // TODO: Remove this line when the content view is added
    boxShadow: '0px 2px 8px 0px #004E8C1A',
    borderTopLeftRadius: '0.5rem', // 8px
    borderTopRightRadius: '0.5rem', // 8px
    position: 'fixed',
    right: '0.75rem', // 12px
    bottom: '0'
  }
});
