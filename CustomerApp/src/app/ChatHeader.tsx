// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Button, Persona } from '@fluentui/react-components';
import { Dismiss20Regular } from '@fluentui/react-icons';
import { useChatHeaderStyles } from './styles/ChatHeader.styles';
import { strings } from './utils/constants';
export interface ChatHeaderProps {
  personaName: string;
  onEndChat(): void;
}

export const ChatHeader = (props: ChatHeaderProps): JSX.Element => {
  const { personaName, onEndChat } = props;
  const styles = useChatHeaderStyles();
  return (
    <div className={styles.chatHeaderContainer} role="banner">
      <Persona
        name={personaName}
        textAlignment="center"
        size="small"
        className={styles.personaContainer}
        avatar={{ color: 'colorful' }}
      />
      <Button
        icon={<Dismiss20Regular />}
        className={styles.closeButton}
        onClick={() => onEndChat()}
        aria-live={'polite'}
        aria-label={strings.close}
      />
    </div>
  );
};
