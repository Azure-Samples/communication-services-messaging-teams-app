// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { floatingWindowStyle } from './styles/ChatFloatingWindow.styles';

interface ChatFloatingWindowProps {
  onCloseButtonClick: () => void;
}

export const ChatFloatingWindow = (props: ChatFloatingWindowProps): JSX.Element => {
  return <Stack className={floatingWindowStyle}></Stack>;
};
