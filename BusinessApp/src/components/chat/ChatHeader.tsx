// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Button } from '@fluentui/react-components';
import { useChatHeaderStyles } from '../../styles/ChatHeader.styles';
import { threadStrings } from '../../utils/constants';
import { Checkmark16Regular } from '@fluentui/react-icons';
import { Persona } from '@fluentui/react-components';
import { ThreadItemStatus } from './useThreads';

export interface ChatHeaderProps {
  personaName: string;
  threadStatus: ThreadItemStatus;
  onResolveChat(): void;
}

export const ChatHeader = (props: ChatHeaderProps): JSX.Element => {
  const { personaName, threadStatus, onResolveChat } = props;
  const styles = useChatHeaderStyles();
  return (
    <div className={styles.chatHeaderContainer} role="banner">
      <Persona
        name={personaName}
        textAlignment="center"
        size="medium"
        avatar={{ color: 'colorful' }}
        primaryText={<span className={styles.primaryText}>{personaName}</span>}
      />
      {threadStatus === ThreadItemStatus.ACTIVE && (
        <Button
          icon={<Checkmark16Regular />}
          className={styles.closeButton}
          onClick={() => onResolveChat()}
          aria-live={'polite'}
          aria-label={threadStrings.close}
        >
          {threadStrings.resolve}
        </Button>
      )}
    </div>
  );
};
