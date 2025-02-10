// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Spinner } from '@fluentui/react-components';
import { useLoadingSpinnerStyles } from '../../styles/LoadingSpinner.styles';

interface LoadingSpinnerProps {
  label?: string;
}

export const LoadingSpinner = (props: LoadingSpinnerProps): JSX.Element => {
  const { label } = props;
  const styles = useLoadingSpinnerStyles();
  return (
    <div className={styles.container}>
      <Spinner label={label} aria-live="assertive" labelPosition="above" />
    </div>
  );
};
