// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// declare let __BUILDTIME__: string; // Injected by webpack
declare let __CHATVERSION__: string; // Injected by webpack
declare let __COMMUNICATIONREACTVERSION__: string; //Injected by webpack
declare let __COMMITID__: string; //Injected by webpack

export const getChatSDKVersion = (): string => __CHATVERSION__;
// export const getBuildTime = (): string => __BUILDTIME__;
export const getCommnicationReactSDKVersion = (): string => __COMMUNICATIONREACTVERSION__;
export const getCommitID = (): string => __COMMITID__;

/**
 * Init React Render Tracker whenever it detects the query param 'rrt' is set to true.
 */
export const initReactRenderTracker = (): void => {
  const urlParams = new URLSearchParams(window.location.search);
  const isEnabled = urlParams.get('rrt');
  if (isEnabled !== 'true') {
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/react-render-tracker';
  document.head.appendChild(script);
};

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
