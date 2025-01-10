// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useChatFloatingWindowStyles } from './styles/ChatFloatingWindow.styles';

interface ChatFloatingWindowProps {
  onCloseButtonClick: () => void;
}

export const ChatFloatingWindow = (props: ChatFloatingWindowProps): JSX.Element => {
  const styles = chatFloatingWindowStyles();
  return <div className={styles.floatingWindow}></div>;
};
