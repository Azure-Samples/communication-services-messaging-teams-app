// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

let endpointUrl: string | undefined;

export const getEndpointUrl = async (): Promise<string> => {
  if (endpointUrl === undefined) {
    try {
      const getRequestOptions = {
        method: 'GET'
      };
      const response = await fetch('/getEndpointUrl', getRequestOptions);
      const retrievedEndpointUrl = await response.text().then((endpointUrl) => endpointUrl);
      endpointUrl = retrievedEndpointUrl;
      return retrievedEndpointUrl;
    } catch (error) {
      throw new Error('Failed at getting environment url');
    }
  } else {
    return endpointUrl;
  }
};
