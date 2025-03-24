// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Text } from '@fluentui/react-components';
import { ErrorCircle48Regular } from '@fluentui/react-icons';
import { useErrorScreenStyles } from '../../styles/ErrorScreen.styles';
import { threadStrings } from '../../utils/constants';

export interface ErrorScreenProps {
  errorMessage: string;
}

export const ErrorScreen = (props: ErrorScreenProps): JSX.Element => {
  const { errorMessage } = props;
  const styles = useErrorScreenStyles();

  return (
    <div className={styles.errorScreenContainer}>
      <div className={styles.textContainer}>
        <ErrorCircle48Regular className={styles.errorIcon} />
        <Text
          aria-level={1}
          aria-label={threadStrings.errorScreenTitle}
          aria-live="polite"
          className={styles.errorTitle}
        >
          {threadStrings.errorScreenTitle}
        </Text>
        <Text aria-level={1} aria-label={errorMessage} aria-live="polite" className={styles.errorMessage}>
          {errorMessage}
        </Text>
      </div>
    </div>
  );
};
