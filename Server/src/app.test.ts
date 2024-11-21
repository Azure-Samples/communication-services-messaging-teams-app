// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jest/index.d.ts" />

import request from "supertest";
import * as identity from "../src/lib/identityClient";
import app from "./app";
import { CommunicationUserToken } from "@azure/communication-identity";

// Setup mocks
const mockUserToken: CommunicationUserToken = {
  user: { communicationUserId: "mock-token-user" },
  token: "mock-token-value",
  expiresOn: new Date(0),
};

let createUserAndTokenSpy: jest.SpyInstance;

beforeAll(() => {
  createUserAndTokenSpy = jest
    .spyOn(identity, "createUserAndToken")
    .mockImplementation(async () => mockUserToken);
});

describe("app route tests", () => {
  test("/token/newUser should return a token with chat scopes with POST requests", async () => {
    const postResponse = await request(app).post("/token/newUser");
    expect(postResponse.status).toEqual(200);
    expect(postResponse.text).toEqual(JSON.stringify(mockUserToken));
    expect(createUserAndTokenSpy).toHaveBeenLastCalledWith(["chat"]);
    createUserAndTokenSpy.mockClear();
  });

  test("/token/newUser?scope=chat,pstn should return a token with chat and pstn scopes with POST requests", async () => {
    const postResponse = await request(app).post(
      "/token/newUser?scope=chat,pstn"
    );
    expect(postResponse.status).toEqual(200);
    expect(postResponse.text).toEqual(JSON.stringify(mockUserToken));
    expect(createUserAndTokenSpy).toHaveBeenLastCalledWith(["chat", "pstn"]);
    createUserAndTokenSpy.mockClear();
  });
});
