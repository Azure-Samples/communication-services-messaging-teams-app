// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ThreadStrings } from './constants';

/**
 * @private
 */
export const formatTimeForThread = (threadDate: Date): string => {
  return threadDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

/**
 * @private
 */
export const formatDateForThread = (threadDate: Date): string => {
  return threadDate.toLocaleDateString();
};

/**
 * Given a thread date object in ISO8601 and a current date object, generates a user friendly timestamp text
 * using the system locale.
 * <time in locale format>.
 * Yesterday.
 * <dateStrings day of week>.
 * <date in locale format>.
 *
 * If thread date is after yesterday, then only show the time.
 * If thread date is before yesterday and after day before yesterday, then show 'Yesterday'.
 * If thread date is before day before yesterday and within the current week, then show 'Monday/Tuesday/etc'.
 *   - We consider start of the week as Sunday. If current day is Sunday, then any time before that is in previous week.
 * If thread date is in previous or older weeks, then show date string.
 *
 * @param threadDate - date of the last thread date of the thread
 * @param currentDate - date used as offset to create the user friendly timestamp (e.g. to create 'Yesterday' instead of an absolute date)
 *
 * @private
 */
export const formatTimestampForThread = (threadDate: Date, todayDate: Date, dateStrings: ThreadStrings): string => {
  if (!threadDate) {
    return '';
  }

  // If thread date was in the same day timestamp string is just the time like '1:30 PM'.
  const startOfDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  if (threadDate > startOfDay) {
    return formatTimeForThread(threadDate);
  }

  // If thread date was yesterday then timestamp string is like this 'Yesterday'.
  const yesterdayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);
  if (threadDate > yesterdayDate) {
    return dateStrings.yesterday;
  }

  // If thread date was before Sunday and today is Sunday (start of week) then timestamp string is like
  // '2025-01-02'.
  const weekDay = todayDate.getDay();
  if (weekDay === 0) {
    return formatDateForThread(threadDate);
  }

  // If thread date was before first day of the week then timestamp string is like Monday.
  const firstDayOfTheWeekDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - weekDay);
  if (threadDate > firstDayOfTheWeekDate) {
    return dayToDayName(threadDate.getDay(), dateStrings);
  }

  // If thread date date is in previous or older weeks then timestamp string is like '2025-01-02'.
  return formatDateForThread(threadDate);
};

const dayToDayName = (day: number, dateStrings: ThreadStrings): string => {
  switch (day) {
    case 0:
      return dateStrings.sunday;
    case 1:
      return dateStrings.monday;
    case 2:
      return dateStrings.tuesday;
    case 3:
      return dateStrings.wednesday;
    case 4:
      return dateStrings.thursday;
    case 5:
      return dateStrings.friday;
    case 6:
      return dateStrings.saturday;
    default:
      throw new Error(`Invalid day [${day}] passed`);
  }
};
