// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Button, Text } from '@fluentui/react-components';
import { useEndConfirmationScreenStyles } from './styles/EndConfirmationScreen.styles';
import { strings } from './utils/constants';

export interface ErrorEndCallProps {
  title: string;
  homeHandler(): void;
}

export const ErrorScreen = (props: ErrorEndCallProps): JSX.Element => {
  const { title, homeHandler } = props;
  const styles = useEndConfirmationScreenStyles();

  return (
    <div className={styles.endChatContainer}>
      <div className={styles.textContainer}>
        <Text aria-level={1} aria-label={title} aria-live="polite" className={styles.endChatTitle}>
          {title}
        </Text>
      </div>

      <div className={styles.buttonContainer}>
        <Button className={styles.button} onClick={homeHandler}>
          {strings.homeButton}
        </Button>
      </div>
    </div>
  );
};
