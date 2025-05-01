// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useId, Button, Toaster, useToastController, Toast, ToastTitle, ToastBody } from '@fluentui/react-components';
import { useEffect } from 'react';
import { useToastNotificationStyles } from '../../styles/ToastNotification.styles';
import { threadStrings } from '../../utils/constants';

interface ToastNotificationProps {
  toasterId: string;
  showToast: boolean;
  toastBodyMessage?: string;
  onViewThread: (threadId: string) => void;
}

export const ToastNotification = (props: ToastNotificationProps): JSX.Element => {
  const { toasterId, showToast, toastBodyMessage, onViewThread } = props;
  const styles = useToastNotificationStyles();
  const id = useId(toasterId);
  const { dispatchToast } = useToastController(id);
  useEffect(() => {
    if (showToast) {
      const notify = (): void => {
        dispatchToast(
          <Toast>
            <ToastTitle
              action={
                <Button appearance="transparent" className={styles.titleButton} onClick={() => onViewThread(toasterId)}>
                  {threadStrings.resolvedToasterViewButton}
                </Button>
              }
            >
              {threadStrings.resolvedToasterTitle}
            </ToastTitle>
            {toastBodyMessage && <ToastBody>{toastBodyMessage}</ToastBody>}
          </Toast>,
          { intent: 'success', position: 'top', timeout: 5000 }
        );
      };
      notify();
    }
  }, [dispatchToast, onViewThread, showToast, styles.titleButton, toastBodyMessage, toasterId]);

  return <Toaster toasterId={id} limit={1} offset={{ vertical: -8 }} />;
};
