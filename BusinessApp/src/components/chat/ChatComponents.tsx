// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { usePropsFor, MessageThread, RichTextSendBox } from '@azure/communication-react';
import { messageThreadStyles, useChatComponentsStyles } from '../../styles/ChatComponents.styles';

export const ChatComponents = (): JSX.Element => {
  const styles = useChatComponentsStyles();
  const messageThreadProps = usePropsFor(MessageThread);
  const richTextSendBoxProps = usePropsFor(RichTextSendBox);

  return (
    <div className={styles.container}>
      <div className={styles.messageThreadContainer}>
        {/*Props are updated asynchronously, so only render the component once props are populated.*/}
        {messageThreadProps && (
          <MessageThread {...messageThreadProps} richTextEditorOptions={{}} styles={messageThreadStyles} />
        )}
      </div>
      <div className={styles.sendBoxContainer}>
        {richTextSendBoxProps && <RichTextSendBox {...richTextSendBoxProps} />}
      </div>
    </div>
  );
};
