// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

declare let __CHATVERSION__: string; // Injected by webpack
declare let __COMMUNICATIONREACTVERSION__: string; //Injected by webpack
declare let __COMMITID__: string; //Injected by webpack

export const getChatSDKVersion = (): string => __CHATVERSION__;
export const getCommnicationReactSDKVersion = (): string => __COMMUNICATIONREACTVERSION__;
export const getCommitID = (): string => __COMMITID__;

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
