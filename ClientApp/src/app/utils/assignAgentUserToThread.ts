// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatusCode } from "./constants";

/**
 * Assigns an agent user to a thread to help the customer
 *
 * @param threadId the acs chat thread id
 */
export const assignAgentUserToThread = async (
  threadId: string
): Promise<boolean> => {
  try {
    const requestOptions = {
      method: "POST"
    };
    const response = await fetch(`/assignAgentUserToThread/${threadId}`, requestOptions);
    console.log("response: 123", response);
    
    if (response.status === StatusCode.CREATED) {
      return true;
    }
    // if we are attempting to add a user to a thread that is not a thread our admin user is already a part of to add in this user
    // we would be unable to add the user
    // so we are returning a 404 if the thread we want to add them to cannot be accessed by our server user
    else if (response.status === StatusCode.NOTFOUND) {
      return false;
    }
  } catch (error) {
    console.error("Failed at assigning agent user to thread, Error: ", error);
  }
  return false;
};
