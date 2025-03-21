// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NOTFOUND = 404
}

export const ENTER_KEY = 13;

export interface ThreadStrings {
  /** String for Sunday */
  sunday: string;
  /** String for Monday */
  monday: string;
  /** String for Tuesday */
  tuesday: string;
  /** String for Wednesday */
  wednesday: string;
  /** String for Thursday */
  thursday: string;
  /** String for Friday */
  friday: string;
  /** String for Saturday */
  saturday: string;
  /** String for Yesterday */
  yesterday: string;
  /** String for Close button text */
  close: string;
  /** String for Resolve button text */
  resolve: string;
  /** String for the error screen title */
  errorScreenTitle: string;
  /** String for the error message of ACS user not linked */
  failToLinkToACSUser: string;
  /** String for the error message of failed to get the Teams user information */
  failToGetTeamsUserInfo: string;
  /** String for no threads */
  noThreads: string;
  /** String for assigned to me label on the thread list */
  assignedToMe: string;
}

export const threadStrings: ThreadStrings = {
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  yesterday: 'Yesterday',
  close: 'Close',
  resolve: 'Resolve',
  errorScreenTitle: 'Configuration error',
  failToLinkToACSUser: 'ACS user not linked.',
  failToGetTeamsUserInfo: 'Failed to get Teams user information',
  noThreads: 'No chats',
  assignedToMe: 'Assigned to me'
};
