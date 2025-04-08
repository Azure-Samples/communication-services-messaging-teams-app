// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as fs from 'fs';
import * as path from 'path';
const appSettingsPath = path.join(__dirname, '../../appsettings.json');

export interface AgentUser {
  teamsUserId: string;
  acsUserId: string;
  displayName: string;
}

let appSettings: {
  ResourceConnectionString: string;
  EndpointUrl: string;
  AdminUserId: string;
  CosmosDBEndpoint: string;
  CosmosDBKey: string;
  AgentUsers: AgentUser[];
};
if (
  !(
    process.env['ResourceConnectionString'] ||
    process.env['EndpointUrl'] ||
    process.env['AdminUserId'] ||
    process.env['CosmosDBEndpoint'] ||
    process.env['CosmosDBKey'] ||
    process.env['AgentUsers']
  )
) {
  if (!fs.existsSync(appSettingsPath)) {
    throw new Error(
      'No appsettings.json found. Please provide an appsettings.json file by copying appsettings.json.sample and removing the .sample extension'
    );
  } else {
    appSettings = require(appSettingsPath);
  }
}

export const getResourceConnectionString = (): string => {
  const resourceConnectionString = process.env['ResourceConnectionString'] || appSettings.ResourceConnectionString;

  if (!resourceConnectionString) {
    throw new Error('No ACS connection string provided');
  }

  return resourceConnectionString;
};

export const getEndpoint = (): string => {
  const uri = new URL(process.env['EndpointUrl'] || appSettings.EndpointUrl);
  return `${uri.protocol}//${uri.host}`;
};

export const getAdminUserId = (): string => {
  const adminUserId = process.env['AdminUserId'] || appSettings.AdminUserId;

  if (!adminUserId) {
    throw new Error('No ACS Admin UserId provided');
  }

  return adminUserId;
};

export const getAgentUsers = (): AgentUser[] => {
  const AgentUsers = process.env['AgentUsers'] ? JSON.parse(process.env['AgentUsers']) : appSettings.AgentUsers;

  if (!AgentUsers) {
    throw new Error('No Agent user list provided');
  }

  return AgentUsers;
};

export const getCosmosDBEndpoint = (): string => {
  const uri = new URL(process.env['CosmosDBEndpoint'] || appSettings.CosmosDBEndpoint);
  return `${uri.protocol}//${uri.host}`;
};

export const getCosmosDBKey = (): string => {
  const cosmosDBKey = process.env['CosmosDBKey'] || appSettings.CosmosDBKey;

  if (!cosmosDBKey) {
    throw new Error('No CosmosDB key provided');
  }

  return cosmosDBKey;
};
