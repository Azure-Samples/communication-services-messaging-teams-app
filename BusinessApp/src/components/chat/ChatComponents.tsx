// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { usePropsFor, MessageThread, RichTextSendBox, CustomAvatarOptions, useTheme } from '@azure/communication-react';
import { messageThreadStyles, useChatComponentsStyles } from '../../styles/ChatComponents.styles';
import { Avatar } from '@fluentui/react-components';

interface ChatComponentsProps {
  isDarkMode: boolean;
}

export const ChatComponents = (props: ChatComponentsProps): JSX.Element => {
  const { isDarkMode } = props;
  const styles = useChatComponentsStyles();
  const messageThreadProps = usePropsFor(MessageThread);
  const richTextSendBoxProps = usePropsFor(RichTextSendBox);

  const theme = useTheme();

  return (
    <div className={styles.container}>
      <div className={styles.messageThreadContainer}>
        {/*Props are updated asynchronously, so only render the component once props are populated.*/}
        {messageThreadProps && (
          <MessageThread
            {...messageThreadProps}
            richTextEditorOptions={{}}
            styles={messageThreadStyles(theme, isDarkMode)}
            onRenderAvatar={(_?: string, options?: CustomAvatarOptions) => {
              return <Avatar name={options?.text} color={'colorful'} size={36} />;
            }}
          />
        )}
      </div>
      <div className={styles.sendBoxContainer}>
        {richTextSendBoxProps && <RichTextSendBox {...richTextSendBoxProps} />}
      </div>
    </div>
  );
};
