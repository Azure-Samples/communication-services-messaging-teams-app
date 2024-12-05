// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { Container, Database } from '@azure/cosmos';
import { CosmosClient } from '@azure/cosmos';
import { getCosmosDBEndpoint, getCosmosDBKey } from './envHelper';

const databaseId = 'messaging-teams-app-database';
enum ContainerId {
  agentWorkItems = 'agentWorkItems'
}

const client = new CosmosClient({
  endpoint: getCosmosDBEndpoint(),
  key: getCosmosDBKey()
});

let database: Database;
let agentWorkItemsContainer: Container;

/**
 * Creates a database if it does not exist.
 * @returns {Promise<Database>} The created or existing container.
 */
const createDatabase = async (): Promise<Database> => {
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  console.info(`Database: ${database.id} is created`);
  return database;
};

/**
 * Creates a container if it does not exist.
 * @returns {Promise<Container>} The created or existing container.
 */
export const createContainer = async (database: Database, containerId: string): Promise<Container> => {
  const { container } = await database.containers.createIfNotExists({ id: containerId });
  console.info(`Container: ${container.id} is created`);
  return container;
};

export const getAgentWorkItemsContainer = async (): Promise<Container> => {
  if (agentWorkItemsContainer) {
    return agentWorkItemsContainer;
  }
  if (!database) {
    database = await createDatabase();
  }
  return await createContainer(database, ContainerId.agentWorkItems);
};
