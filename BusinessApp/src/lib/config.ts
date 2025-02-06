// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const config = {
  initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL || 'https://localhost:3000/auth-start.html',
  clientId: process.env.REACT_APP_CLIENT_ID || ''
};

export default config;
