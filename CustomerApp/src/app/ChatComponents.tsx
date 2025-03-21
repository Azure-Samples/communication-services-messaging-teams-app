// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { usePropsFor, MessageThread, RichTextSendBox, CustomAvatarOptions } from '@azure/communication-react';
import { messageThreadStyles, useChatComponentsStyles } from './styles/ChatComponents.styles';
import { Avatar } from '@fluentui/react-components';

function ChatComponents(): JSX.Element {
  const styles = useChatComponentsStyles();
  const messageThreadProps = usePropsFor(MessageThread);
  const richTextSendBoxProps = usePropsFor(RichTextSendBox);

  return (
    <div className={styles.container}>
      <div className={styles.messageThreadContainer}>
        {/*Props are updated asynchronously, so only render the component once props are populated.*/}
        {messageThreadProps && (
          <MessageThread
            {...messageThreadProps}
            richTextEditorOptions={{}}
            styles={messageThreadStyles}
            onRenderAvatar={(_?: string, options?: CustomAvatarOptions) => {
              return <Avatar name={options?.text} color={'colorful'} size={28} />;
            }}
          />
        )}
      </div>
      <div className={styles.sendBoxContainer}>
        {richTextSendBoxProps && <RichTextSendBox {...richTextSendBoxProps} />}
      </div>
    </div>
  );
}

export default ChatComponents;
