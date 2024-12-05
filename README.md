# B2C Customer-Agent Messaging Teams App

## Overview

This is a sample application to show how we can build a custom [Teams App](https://docs.microsoft.com/microsoftteams/platform/overview#build-apps-with-microsoft-teams-platform) that can interface with an Azure Communication Services instance, enabling the two systems to work together while keeping their backend environments and identity configurations separate.

This sample contains three standalone applications that together provide the complete experience of a customer support scenario:

- AgentApp: this is a custom Teams app. The agents, who have access to a Microsoft Teams account, can use this app to view all the incoming customer chats that assigned to them and provide customer support within the Microsoft Teams ecosystem.
- ClientApp: this is a web-based app that provides quick access to customers who do not have access to a Microsoft Teams account.
- Server: this is a backend application that supports both the AgentApp and the Client App.

## Prerequisites

- [Visual Studio Code (Stable Build)](https://code.visualstudio.com/Download).
- [Node.js](https://nodejs.org/), supported versions: 18.
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource). You'll need to record your resource **connection string** for this sample app.
- A [Microsoft 365 account for development](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts).
- [Set up your dev environment for extending Teams apps across Microsoft 365](https://aka.ms/teamsfx-m365-apps-prerequisites).
  Please note that after you enrolled your developer tenant in Office 365 Target Release, it may take couple days for the enrollment to take effect.
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [Teams Toolkit CLI](https://aka.ms/teamsfx-toolkit-cli).
- (TODO: add optional prerequisites for file uploading).

## Code structure

- [AgentApp](./AgentApp) - A custom Teams app for agents to provide customer support

  - [/index.tsx](./AgentApp/src/index.tsx) - Entry point of this app
  - [/src](./AgentApp/src) - The source code for the frontend of the Teams custom application.
  - [/.vscode](./AgentApp/.vscode) - VSCode files for debugging
  - [/appPackage](./AgentApp/appPackage) - Teams application manifest
  - [/env](./AgentApp/env) - Environment files
  - [/infra](./AgentApp/env) - files for provisioning Azure resources
    The following are Teams Toolkit specific project files. You can [visit a complete guide on Github](https://github.com/OfficeDev/TeamsFx/wiki/Teams-Toolkit-Visual-Studio-Code-v5-Guide#overview) to understand how Teams Toolkit works.
  - [/teamsapp.yml](./AgentApp/teamsapp.yml) - This is the main Teams Toolkit project file. The project file defines two primary things: Properties and configuration Stage
  - [/teamsapp.local.yml](./AgentApp/teamsapp.local.yml) - This overrides `teamsapp.yml` with actions that enable local execution and debugging.
  - [/aad.manifest.json](./AgentApp/aad.manifest.json) - This file defines the configuration of Microsoft Entra app. This template will only provision [single tenant](https://learn.microsoft.com/azure/active-directory/develop/single-and-multi-tenant-apps#who-can-sign-in-to-your-app) Microsoft Entra app.

- [ClientApp](./ClientApp) - A web app where customers can start an ACS chat without a Microsoft Teams account.
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
1. Get the `Connection String` and `Endpoint` from the Azure portal. For more information on connection strings and endpoint strings, see [Create an Azure Communication Resources](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
1. Once you get the `Connection String`, add the connection string to the **samples/Server/appsetting.json** file under the `ResourceConnectionString` variable.
1. Once you get the `Endpoint`, add the endpoint string to the **samples/Server/appsetting.json** file under the `EndpointUrl` variable.
1. Get the `Identity` from the Azure portal. Click on `Identities & User Access Tokens` in Azure portal. Generate a user with `Chat` scope. For more information on identity strings, see [Create and manage access tokens](https://docs.microsoft.com/azure/communication-services/quickstarts/identity/access-tokens).
1. Once you get the `identity` string, add the identity string to the **samples/Server/appsetting.json** file under the `AdminUserId` variable. This is the server user to add new users to the chat thread.
1. (TODO: Add instruction for CosmosDB related variables and AgentUsers. Also add instruction for `AzureBlobStorageConnectionString` as an optional step).

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
