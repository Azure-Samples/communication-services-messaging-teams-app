// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Button } from '@fluentui/react-components';
import { Chat20Filled } from '@fluentui/react-icons';
import { useGetLiveHelpButtonStyles } from './styles/GetLiveHelpButton.styles';
import { strings } from './utils/constants';

interface GetLiveHelpButtonProps {
  onGetLiveHelpButtonClick: () => void;
}

export const GetLiveHelpButton = (props: GetLiveHelpButtonProps): JSX.Element => {
  const { onGetLiveHelpButtonClick } = props;
  const styles = useGetLiveHelpButtonStyles();

  return (
    <Button
      id={strings.getLiveHelp}
      aria-label={strings.getLiveHelp}
      className={styles.button}
      icon={<Chat20Filled className={styles.chatIcon} />}
      onClick={onGetLiveHelpButtonClick}
    >
      {strings.getLiveHelp}
    </Button>
  );
};
