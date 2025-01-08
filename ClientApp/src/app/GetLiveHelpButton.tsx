// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultButton, mergeStyles, useTheme } from '@fluentui/react';
import { Chat20Filled } from '@fluentui/react-icons';
import { buttonStyle, buttonWithIconStyles, chatIconStyle } from './styles/GetLiveHelpButton.styles';
import { strings } from './utils/constants';

interface GetLiveHelpButtonProps {
  onGetLiveHelpButtonClick: () => void;
}

export const GetLiveHelpButton = (props: GetLiveHelpButtonProps): JSX.Element => {
  const { onGetLiveHelpButtonClick } = props;
  const theme = useTheme();

  return (
    <DefaultButton
      id={strings.getLiveHelp}
      aria-label={strings.getLiveHelp}
      text={strings.getLiveHelp}
      className={mergeStyles(buttonStyle, {
        color: theme.palette.themeDarker
      })}
      styles={buttonWithIconStyles}
      onClick={() => {
        onGetLiveHelpButtonClick();
      }}
      onRenderIcon={() => (
        <Chat20Filled
          className={mergeStyles(chatIconStyle, {
            color: theme.palette.themeDarker
          })}
        />
      )}
    />
  );
};
