// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultButton, Icon, IconButton, mergeStyles, Stack } from '@fluentui/react';
import {
  buttonWithIconStyles,
  chatHeaderContainerStyle,
  greyIconButtonStyle,
  largeLeaveButtonContainerStyle,
  leaveButtonStyle,
  leaveIcon,
  leaveIconStyle,
  paneButtonContainerStyle,
  smallLeaveButtonContainerStyle
} from '../../styles/ChatHeader.styles';
import { useTheme } from '@azure/communication-react';

export interface ChatHeaderProps {
  onResolveChat(): void;
}

export const ChatHeader = (props: ChatHeaderProps): JSX.Element => {
  const theme = useTheme();

  const resolveString = 'Resolve';
  return (
    <Stack
      horizontal={true}
      verticalAlign={'center'}
      horizontalAlign="end"
      className={chatHeaderContainerStyle}
      role="banner"
    >
      <div className={paneButtonContainerStyle}>{}</div>
      <DefaultButton
        className={mergeStyles(largeLeaveButtonContainerStyle, leaveButtonStyle, {
          color: theme.palette.neutralPrimaryAlt
        })}
        styles={buttonWithIconStyles}
        text={resolveString}
        onClick={() => props.onResolveChat()}
        onRenderIcon={() => <Icon iconName={leaveIcon.iconName} className={leaveIconStyle} />}
        aria-live={'polite'}
        aria-label={resolveString}
      />
      <IconButton
        iconProps={leaveIcon}
        className={mergeStyles(smallLeaveButtonContainerStyle, greyIconButtonStyle, {
          color: theme.palette.neutralPrimaryAlt
        })}
        onClick={() => props.onResolveChat()}
        ariaLabel={resolveString}
        aria-live={'polite'}
      />
    </Stack>
  );
};
