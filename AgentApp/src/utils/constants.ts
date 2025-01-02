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
}

export const threadStrings: ThreadStrings = {
  yesterday: 'Yesterday',
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday'
};
