// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Capitalize the first letter of a string
 * @param str - input string
 * @returns string with the first letter capitalized
 */
export const capitalizeString = (str: string): string => {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
