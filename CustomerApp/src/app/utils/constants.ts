// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NOTFOUND = 404
}

export const ENTER_KEY = 'Enter';

export const strings = {
  getLiveHelp: 'Get live help',
  startChat: 'Start chat',
  close: 'Close',
  chatWithAnExpert: 'Chat with an expert',
  configurationDisplayNameLabelText: 'Your name',
  configurationDisplayNamePlaceholder: 'Enter name',
  configurationQuestionSummaryLabelText: 'How can we help you today?',
  configurationQuestionSummaryPlaceholder: 'Briefly summarize your issue',
  requiredTextFiledErrorMessage: 'Required',
  initializeChatSpinnerLabel: 'Loading chat...',
  unableToStartChat: 'Unable to start chat.',
  endChatConfirmationTitle: 'Leave chat?',
  endChatConfirmationDescription: 'Your conversation is not saved',
  endChatConfirmationConfirmButton: 'Leave and close',
  endChatConfirmationCancelButton: 'Cancel',
  errorScreenTitle: 'We ran into a problem',
  errorScreenRetryButton: 'Retry',
  pageNotFoundErrorMessage: 'Page not found',
  conversationResolvedByAgent: 'Your conversation has ended.',
  resumeConversation: 'Resume a conversation by sending a message.'
};
