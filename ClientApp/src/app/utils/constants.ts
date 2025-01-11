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
  configurationDisplayNameEmptyErrorMessage: 'Name cannot be empty',
  configurationQuestionSummaryLabelText: 'How can we help you today?',
  configurationQuestionSummaryPlaceholder: 'Briefly summarize your issue',
  configurationQuestionSummaryEmptyErrorMessage: 'This text field cannot be empty',
  initializeChatSpinnerLabel: 'Initializing chat client...',
  failToCreateChatClient: 'Failed to create chat client, please revisit home page to create a new thread',
  failToJoinChatThread: 'Failed to join the chat thread, please revisit home page to create a new thread',
  failToAssignAgent: 'Failed to assign an agent to the chat thread, please revisit home page to create a new thread'
};
