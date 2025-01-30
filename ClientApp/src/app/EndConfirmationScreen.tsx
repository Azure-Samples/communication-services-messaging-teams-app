// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Button, Text } from '@fluentui/react-components';
import { useEndConfirmationScreenStyles } from './styles/EndConfirmationScreen.styles';
import { strings } from './utils/constants';

export interface EndCallProps {
  onConfirmLeaving(): void;
  onCancel(): void;
}

export const EndConfirmationScreen = (props: EndCallProps): JSX.Element => {
  const { onConfirmLeaving, onCancel } = props;
  const styles = useEndConfirmationScreenStyles();

  return (
    <div className={styles.endChatContainer}>
      <div className={styles.textContainer}>
        <Text
          aria-level={1}
          aria-label={strings.endChatConfirmationTitle}
          aria-live="polite"
          className={styles.endChatTitle}
        >
          {strings.endChatConfirmationTitle}
        </Text>
        <Text
          aria-level={1}
          aria-label={strings.endChatConfirmationDescription}
          aria-live="polite"
          className={styles.endChatDescription}
        >
          {strings.endChatConfirmationDescription}
        </Text>
      </div>

      <div className={styles.buttonContainer}>
        <Button appearance="primary" className={styles.button} onClick={onConfirmLeaving}>
          {strings.endChatConfirmationConfirmButton}
        </Button>
        <Button className={styles.button} onClick={onCancel}>
          {strings.endChatConfirmationCancelButton}
        </Button>
      </div>
    </div>
  );
};
