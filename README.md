# B2C Customer-Agent Messaging Teams App

## Overview

This is a sample application to show how we can build a custom [Teams App](https://docs.microsoft.com/microsoftteams/platform/overview#build-apps-with-microsoft-teams-platform) that can interface with an Azure Communication Services instance, enabling the two systems to work together while keeping their backend environments and identity configurations separate.

This sample includes three standalone applications: ClientApp, AgentApp, and Server. Together, they provide a comprehensive customer support experience. The overall view of the system is shown below:
<br>
<img src="./Assets/architecture-diagram.png" alt="Flow Chat" width="1024">

1. An Azure Communications Services (ACS) instance that enables the chat experience.
2. **AgentApp**: A web application hosted within a custom Teams application and deployed to Teams through an iframe inside the Teams client. Agents utilize this app within their Teams client.
3. **ClientApp**: A web application used by customers to interact with agents.
4. **Server** app: a web API provides the necessary server-side functionality for the AgentApp and the ClientApp.
5. **Database**: An Azure Cosmos database to store metadata related to chat threads, such as their status.
6. **Identity mapping**: The Azure Communications Services instance is not directly connected to the Teams environment. The Communications Services environment is surfaced through the custom Teams application.
   The custom Teams application (AgentApp) leverages Teams’ Single Sign-On (SSO) to retrieve the Teams user ID, which is then used to map to a communication service user ID.
   The AgentApp will use this communication service user ID to access the Azure Communication Services environment.

## Prerequisites

- [Visual Studio Code (Stable Build)](https://code.visualstudio.com/Download).
- [Node.js](https://nodejs.org/), supported versions: 18.
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource). You'll need to record your resource **connection string** for this sample app.
- Create an Azure Cosmos DB for NoSQL account. For details, see [Create an Azure Cosmos DB account](https://docs.microsoft.com/azure/cosmos-db/nosql/tutorial-nodejs-web-app#create-account). You'll need to record the **URI** and **PRIMARY KEY** for this sample app.
- A [Microsoft 365 account for development](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts).
- [Set up your dev environment for extending Teams apps across Microsoft 365](https://aka.ms/teamsfx-m365-apps-prerequisites).
  Please note that after you enrolled your developer tenant in Office 365 Target Release, it may take couple days for the enrollment to take effect.
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [Teams Toolkit CLI](https://aka.ms/teamsfx-toolkit-cli).
- (Optional) To enable the file uploading functionality, an [Azure Blob Storage](https://learn.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-nodejs?tabs=managed-identity%2Croles-azure-portal%2Csign-in-azure-cli&pivots=blob-storage-quickstart-scratch) is needed.
  - For using azure storage in production environments, please follow the azure storage [application architecture guide](https://learn.microsoft.com/azure/architecture/guide/multitenant/service/storage).

## Code structure

- [AgentApp](./AgentApp) - A custom Teams app for agents to provide customer support

  - [/index.tsx](./AgentApp/src/index.tsx) - Entry point of this app
  - [/src](./AgentApp/src) - The source code for the frontend of the Teams custom application
  - [/.vscode](./AgentApp/.vscode) - VSCode files for debugging
  - [/appPackage](./AgentApp/appPackage) - Teams application manifest
  - [/env](./AgentApp/env) - Environment files
  - [/infra](./AgentApp/env) - files for provisioning Azure resources
    The following are Teams Toolkit specific project files. You can [visit a complete guide on Github](https://github.com/OfficeDev/TeamsFx/wiki/Teams-Toolkit-Visual-Studio-Code-v5-Guide#overview) to understand how Teams Toolkit works
  - [/teamsapp.yml](./AgentApp/teamsapp.yml) - This is the main Teams Toolkit project file. The project file defines two primary things: Properties and configuration Stage
  - [/teamsapp.local.yml](./AgentApp/teamsapp.local.yml) - This overrides `teamsapp.yml` with actions that enable local execution and debugging
  - [/aad.manifest.json](./AgentApp/aad.manifest.json) - This file defines the configuration of Microsoft Entra app. This template will only provision [single tenant](https://learn.microsoft.com/azure/active-directory/develop/single-and-multi-tenant-apps#who-can-sign-in-to-your-app) Microsoft Entra app

- [ClientApp](./ClientApp) - A web app where customers can start an ACS chat without a Microsoft Teams account
  - [/index.tsx](./ClientApp/src/index.tsx) - Entry point of this app
- [Server](./Server) - A server app that supports the AgentApp and the ClientApp
  - [/app.ts](./Server/src/app.ts) - Entry point of this app
  - [/appsettings.json.sample](./Server/appsettings.json.sample) - The sample file for all the environment variables needed to run the Server app

## Before running the sample for the first time

1. Open an instance of PowerShell, Windows Terminal, Command Prompt, or equivalent, and navigate to the directory that you'd like to clone the sample to and clone the repo.

   ```shell
   git clone https://github.com/Azure-Samples/communication-services-messaging-teams-app.git
   ```

1. Copy `Server/appsettings.json.sample` and remove the `.sample` extension.
1. Fill in the following variables in the newly created `Server/appsettings.json` file:
   1. **ResourceConnectionString**: Use the `Connection String` from the Azure portal. For more information on connection strings, see [Create an Azure Communication Resources](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
   1. **EndpointUrl**: Use the `Endpoint` from the Azure portal. For more information on endpoint strings, see [Create an Azure Communication Resources](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
   1. **AdminUserId**: Create a new ACS user as a server user to add new users to the chat thread. You can get this value by clicking on `Identities & User Access Tokens` in Azure portal. Generate a user with `Chat` scope. Then use the `Identity` value for this variable. For more information on identity strings, see [Create and manage access tokens](https://docs.microsoft.com/azure/communication-services/quickstarts/identity/access-tokens).
   1. **CosmosDBEndpoint**: Use the `URI` value from the Azure portal's Cosmos DB account. For more information on Azure Cosmos DB account, see [Create an Azure Cosmos DB account](https://docs.microsoft.com/azure/cosmos-db/nosql/tutorial-nodejs-web-app#create-account).
   1. **CosmosDBKey**: Use the `PRIMARY KEY` value from the Azure portal's Cosmos DB account. For more information on Azure Cosmos DB account, see [Create an Azure Cosmos DB account](https://docs.microsoft.com/azure/cosmos-db/nosql/tutorial-nodejs-web-app#create-account).
   1. **AgentUsers**: An array of agent users that can use the agentApp. Each agent user object should contain the following values:
      1. **teamsUserId**: Use the `Object ID` from the Azure portal. For more information on user's object Id, see [Find the user object ID](https://docs.microsoft.com/partner-center/account-settings/find-ids-and-domain-names#find-the-user-object-id).
      1. **acsUserId**: Each agent should be linked to an ACS user. The AgentApp will use this credential to retrieve chat threads data and to communicate with customers in the ACS environment.
         You can get this value by clicking on `Identities & User Access Tokens` in Azure portal. Generate a user with `Chat` scope. Then use the `Identity` value for this variable. For more information on identity strings, see [Create and manage access tokens](https://docs.microsoft.com/azure/communication-services/quickstarts/identity/access-tokens).
      1. **displayName**: Assign a display name for this agent.
   1. **AzureBlobStorageConnectionString** (Optional): This value is needed to enable the file uploading functionality.
      Use the `Connection string` value from the Azure portal's Storage accounts page. For more information on storage accounts connection strings, see [Manage storage account access keys](https://docs.microsoft.com/azure/storage/common/storage-account-keys-manage?tabs=azure-portal).

## Local run

1. Start the ClientApp

   ```bash
   cd ClientApp && npm install && npm start
   ```

   This will open a client server on port 3000 that serves the website files.
   <br>

1. Start the Server app

   ```bash
   cd Server && npm install && npm start
   ```

   This will start an api server on port 8080 that performs functionality like minting tokens for chat participants and storing the chat thread.
   <br>

1. Start the AgentApp

   1. First, select the Teams Toolkit icon on the left in the VS Code toolbar.
   2. In the Account section, sign in with your [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) if you haven't already.
   3. Press F5 to start debugging which launches your app in Teams using a web browser. Select `Debug in Teams (Edge)` or `Debug in Teams (Chrome)`.
   4. When Teams launches in the browser, select the `Add` button in the dialog to install the AgentApp to Teams.

   This will open a browser window with the AgentApp running inside Teams web client.

## Deploy

\<TBD\>

## Additional Reading

- [Embed chat in a Microsoft Teams custom app](https://learn.microsoft.com/azure/communication-services/tutorials/chat-app-teams-embed)
- [Azure Communication Services - UI Library](https://azure.github.io/communication-ui-library/) - To learn more about what the `@azure/communication-react` package offers.
- [Azure Communication Chat SDK](https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-communication-chat/1.0.0-beta.3/index.html) - To learn more about the chat web sdk
- [Add or manage the environment](https://learn.microsoft.com/microsoftteams/platform/toolkit/teamsfx-multi-env)
- [Create multi-capability app](https://learn.microsoft.com/microsoftteams/platform/toolkit/add-capability)
- [Use an existing Microsoft Entra application](https://learn.microsoft.com/microsoftteams/platform/toolkit/use-existing-aad-app)
- [Customize the Teams app manifest](https://learn.microsoft.com/microsoftteams/platform/toolkit/teamsfx-preview-and-customize-app-manifest)
- Host your app in Azure by [provision cloud resources](https://learn.microsoft.com/microsoftteams/platform/toolkit/provision) and [deploy the code to cloud](https://learn.microsoft.com/microsoftteams/platform/toolkit/deploy)
- [Collaborate on app development](https://learn.microsoft.com/microsoftteams/platform/toolkit/teamsfx-collaboration)
- [Set up the CI/CD pipeline](https://learn.microsoft.com/microsoftteams/platform/toolkit/use-cicd-template)
- [Publish the app to your organization or the Microsoft Teams app store](https://learn.microsoft.com/microsoftteams/platform/toolkit/publish)
- [Enable the app for multi-tenant](https://github.com/OfficeDev/TeamsFx/wiki/Multi-tenancy-Support-for-Azure-AD-app)
- [Preview the app on mobile clients](https://aka.ms/teamsfx-mobile)
