// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  usePropsFor,
  MessageThread,
  RichTextSendBox,
  CustomAvatarOptions,
  ChatMessage,
  CustomMessage,
  Message,
  MessageProps,
  MessageRenderer
} from '@azure/communication-react';
import { messageThreadStyles, useChatComponentsStyles } from './styles/ChatComponents.styles';
import { Avatar, Label } from '@fluentui/react-components';
import { useCallback, useEffect, useState } from 'react';

interface ChatComponentsProps {
  isResolvedByAgent: boolean;
  onResumeConversation: (content: string) => void;
}

function ChatComponents(props: ChatComponentsProps): JSX.Element {
  const { isResolvedByAgent, onResumeConversation } = props;
  const styles = useChatComponentsStyles();
  const messageThreadProps = usePropsFor(MessageThread);
  const richTextSendBoxProps = usePropsFor(RichTextSendBox);
  const [messages, setMessages] = useState<Message[]>(messageThreadProps?.messages || []);

  useEffect(() => {
    // merge messageThreadProps.messages with local messages
    if (messageThreadProps?.messages) {
      setMessages((prevMessages) => {
        const serverMessages = messageThreadProps.messages;
        const mergedMessages = [...prevMessages, ...serverMessages];
        // Remove duplicate messages based on messageId
        const uniqueMessages = Array.from(new Set(mergedMessages.map((msg) => msg.messageId)))
          .map((id) => mergedMessages.find((msg) => msg.messageId === id))
          .filter((msg): msg is ChatMessage => msg !== undefined && msg.messageId !== '');
        return uniqueMessages.sort((a, b) => a.createdOn.getTime() - b.createdOn.getTime());
      });
    }
  }, [messageThreadProps?.messages]);

  const createSystemMessage = (content: string): CustomMessage => {
    return {
      messageId: Math.random().toString(),
      messageType: 'custom',
      content,
      createdOn: new Date()
    };
  };

  useEffect(() => {
    if (!isResolvedByAgent) {
      return;
    }
    // Insert to the message list
    const resolveSystemMessage = createSystemMessage('Your conversation has ended.');
    const resumeSystemMessage = createSystemMessage('Resume a conversation by sending a message. ');
    setMessages((prevMessages) => [...prevMessages, resolveSystemMessage, resumeSystemMessage]);
  }, [isResolvedByAgent]);

  const handleOnSendMessage = useCallback(
    async (content: string) => {
      if (isResolvedByAgent) {
        onResumeConversation(content);
      }
      await richTextSendBoxProps.onSendMessage(content, { type: 'html' });
    },
    [isResolvedByAgent, onResumeConversation, richTextSendBoxProps]
  );

  return (
    <div className={styles.container}>
      <div className={styles.messageThreadContainer}>
        {/*Props are updated asynchronously, so only render the component once props are populated.*/}
        {messageThreadProps && (
          <MessageThread
            {...messageThreadProps}
            messages={messages}
            richTextEditorOptions={{}}
            styles={messageThreadStyles}
            onRenderAvatar={(_?: string, options?: CustomAvatarOptions) => {
              return <Avatar name={options?.text} color={'colorful'} size={28} />;
            }}
            onRenderMessage={(messageProps: MessageProps, messageRenderer?: MessageRenderer) => {
              if (messageProps.message.messageType === 'custom') {
                return (
                  <div className={styles.resolveSystemMessageContainer}>
                    <Label className={styles.resolveSystemMessage}>{messageProps.message.content}</Label>
                  </div>
                );
              }
              return messageRenderer?.(messageProps) || <></>;
            }}
          />
        )}
      </div>
      <div className={styles.sendBoxContainer}>
        {richTextSendBoxProps && <RichTextSendBox {...richTextSendBoxProps} onSendMessage={handleOnSendMessage} />}
      </div>
    </div>
  );
}

export default ChatComponents;
