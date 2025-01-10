// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { inputSectionStyles, textFieldStyle } from './styles/InputSection.styles';
import { Field, Input, Textarea } from '@fluentui/react-components';
import { ENTER_KEY } from './utils/constants';

interface InputSectionProps {
  labelText: string;
  placeholder: string;
  emptyErrorMessage: string;
  isEmpty: boolean;
  isMultiline?: boolean;
  onTextChangedHandler?(newValue: string): void;
  onKeyDownHandler?(): void;
}

export const InputSection = (props: InputSectionProps): JSX.Element => {
  const {
    labelText,
    placeholder,
    emptyErrorMessage,
    isEmpty,
    isMultiline = false,
    onTextChangedHandler,
    onKeyDownHandler
  } = props;
  const styles = inputSectionStyles();

  const onTextChanged = (event: React.FormEvent<HTMLDivElement>): void => {
    const newValue = (event.target as HTMLInputElement).value;
    onTextChangedHandler?.(newValue);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === ENTER_KEY) {
      onKeyDownHandler?.();
    }
  };

  return (
    <Field
      label={labelText}
      validationState={isEmpty ? 'error' : undefined}
      validationMessage={isEmpty ? emptyErrorMessage : undefined}
      size="small"
      className={styles.textFieldContainer}
      onChange={onTextChanged}
      onKeyDown={handleOnKeyDown}
    >
      {isMultiline ? (
        <Textarea
          placeholder={placeholder}
          size="large"
          textarea={{ className: styles.textFieldTextStyle, style: textFieldStyle }}
        />
      ) : (
        <Input
          placeholder={placeholder}
          size="medium"
          input={{ className: styles.textFieldTextStyle, style: textFieldStyle }}
        />
      )}
    </Field>
  );
};
