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
import { strings } from './utils/constants';
import { nanoid } from 'nanoid';

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
        const uniqueMessages: Message[] = Array.from(
          mergedMessages
            .reduce((map, msg) => {
              if (msg.messageId && msg.messageId !== '' && !map.has(msg.messageId)) {
                map.set(msg.messageId, msg);
              }
              return map;
            }, new Map())
            .values()
        );
        return uniqueMessages.sort((a, b) => a.createdOn.getTime() - b.createdOn.getTime());
      });
    }
  }, [messageThreadProps?.messages]);

  const createSystemMessage = (content: string): CustomMessage => {
    return {
      messageId: nanoid(),
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
    const resolveSystemMessage = createSystemMessage(strings.conversationResolvedByAgent);
    const resumeSystemMessage = createSystemMessage(strings.resumeConversation);
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

  const onRenderMessage = useCallback(
    (messageProps: MessageProps, messageRenderer?: MessageRenderer) => {
      if (messageProps.message.messageType === 'custom') {
        return (
          <div className={styles.resolveSystemMessageContainer}>
            <Label className={styles.resolveSystemMessage}>{messageProps.message.content}</Label>
          </div>
        );
      }
      return messageRenderer?.(messageProps) || <></>;
    },
    [styles.resolveSystemMessage, styles.resolveSystemMessageContainer]
  );

  const handleOnUpdateMessage = useCallback(
    async (messageId: string, content: string) => {
      const message = messages.find((msg) => msg.messageId === messageId);
      if (message) {
        (message as ChatMessage).content = content;
        setMessages([...messages]);
      }
      await messageThreadProps.onUpdateMessage(messageId, content, { type: 'html' });
    },
    [messageThreadProps, messages]
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
            onRenderMessage={onRenderMessage}
            onUpdateMessage={handleOnUpdateMessage}
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
