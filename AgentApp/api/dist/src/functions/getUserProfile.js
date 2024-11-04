"use strict";
/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
// Import polyfills for fetch required by msgraph-sdk-javascript.
const functions_1 = require("@azure/functions");
const teamsfx_1 = require("@microsoft/teamsfx");
const config_1 = __importDefault(require("../config"));
const azureTokenCredentials_1 = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
/**
 * This function handles requests from teamsapp client.
 * The HTTP request should contain an SSO token queried from Teams in the header.
 *
 * This function initializes the teamsapp SDK with the configuration and calls these APIs:
 * - new OnBehalfOfUserCredential(accessToken, oboAuthConfig) - Construct OnBehalfOfUserCredential instance with the received SSO token and initialized configuration.
 * - getUserInfo() - Get the user's information from the received SSO token.
 *
 * The response contains multiple message blocks constructed into a JSON object, including:
 * - An echo of the request body.
 * - The display name encoded in the SSO token.
 * - Current user's Microsoft 365 profile if the user has consented.
 *
 * @param {InvocationContext} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 */
function getUserProfile(req, context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        context.log("HTTP trigger function processed a request.");
        // Initialize response.
        const res = {
            status: 200,
        };
        const body = Object();
        // Put an echo into response body.
        body.receivedHTTPRequestBody = (yield req.text()) || "";
        // Prepare access token.
        const accessToken = (_a = req.headers.get("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "").trim();
        if (!accessToken) {
            return {
                status: 400,
                body: JSON.stringify({
                    error: "No access token was found in request header.",
                }),
            };
        }
        const oboAuthConfig = {
            authorityHost: config_1.default.authorityHost,
            clientId: config_1.default.clientId,
            tenantId: config_1.default.tenantId,
            clientSecret: config_1.default.clientSecret,
        };
        let oboCredential;
        try {
            oboCredential = new teamsfx_1.OnBehalfOfUserCredential(accessToken, oboAuthConfig);
        }
        catch (e) {
            context.error(e);
            return {
                status: 500,
                body: JSON.stringify({
                    error: "Failed to construct OnBehalfOfUserCredential using your accessToken. " +
                        "Ensure your function app is configured with the right Microsoft Entra App registration.",
                }),
            };
        }
        // Query user's information from the access token.
        try {
            const currentUser = yield oboCredential.getUserInfo();
            if (currentUser && currentUser.displayName) {
                body.userInfoMessage = `User display name is ${currentUser.displayName}.`;
            }
            else {
                body.userInfoMessage = "No user information was found in access token.";
            }
        }
        catch (e) {
            context.error(e);
            return {
                status: 400,
                body: JSON.stringify({
                    error: "Access token is invalid.",
                }),
            };
        }
        // Create a graph client with default scope to access user's Microsoft 365 data after user has consented.
        try {
            // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
            const authProvider = new azureTokenCredentials_1.TokenCredentialAuthenticationProvider(oboCredential, {
                scopes: ["https://graph.microsoft.com/.default"],
            });
            // Initialize Graph client instance with authProvider
            const graphClient = microsoft_graph_client_1.Client.initWithMiddleware({
                authProvider: authProvider,
            });
            body.graphClientMessage = yield graphClient.api("/me").get();
        }
        catch (e) {
            context.error(e);
            return {
                status: 500,
                body: JSON.stringify({
                    error: "Failed to retrieve user profile from Microsoft Graph. The application may not be authorized.",
                }),
            };
        }
        res.body = JSON.stringify(body);
        return res;
    });
}
exports.getUserProfile = getUserProfile;
functions_1.app.http("getUserProfile", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    handler: getUserProfile,
});
// You can replace the codes above from the function body with comment "Query user's information from the access token." to the end
// with the following codes to use application permission to get user profiles.
// Remember to get admin consent of application permission "User.Read.All".
/*
// Query user's information from the access token.
  let userName: string;
  try {
    const currentUser: UserInfo = await teamsfx.getUserInfo();
    console.log(currentUser);
    userName = currentUser.preferredUserName; // Will be used in app credential flow
    if (currentUser && currentUser.displayName) {
      res.body.userInfoMessage = `User display name is ${currentUser.displayName}.`;
    } else {
      res.body.userInfoMessage = "No user information was found in access token.";
    }
  } catch (e) {
    context.error(e);
    return {
      status: 400,
      body: {
        error: "Access token is invalid.",
      },
    };
  }

  // Use IdentityType.App + client secret to create a teamsfx
  const appAuthConfig: AppCredentialAuthConfig = {
    clientId: process.env.M365_CLIENT_ID,
    clientSecret: process.env.M365_CLIENT_SECRET,
    authorityHost: process.env.M365_AUTHORITY_HOST,
    tenantId: process.env.M365_TENANT_ID,
  };
  try {
    const appCredential = new AppCredential(appAuthConfig);
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      body: {
        error:
          "App credential error:" +
          "Failed to construct TeamsFx using your accessToken. " +
          "Ensure your function app is configured with the right Microsoft Entra App registration.",
      },
    };
  }

  // Create a graph client with default scope to access user's Microsoft 365 data after user has consented.
  try {
    // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
    const authProvider = new TokenCredentialAuthenticationProvider(appCredential, {
      scopes: ["https://graph.microsoft.com/.default"],
    });

    // Initialize the Graph client
    const graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });

    const profile: any = await graphClient.api("/users/"+userName).get();
    res.body.graphClientMessage = profile;
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      body: {
        error:
          "Failed to retrieve user profile from Microsoft Graph. The application may not be authorized.",
      },
    };
  }
*/
//# sourceMappingURL=getUserProfile.js.map