import "./AgentScreen.css";
import { ChatScreen } from "./ChatScreen";

export function AgentScreen() {
// Temporary using hard coded value until fetching thread is implemented
  const ENDPOINT_URL = "<Azure Communication Services Resource Endpoint>";
  const TOKEN = "<Azure Communication Services Resource Access Token>";
  const USER_ID = "<User Id associated to the token>";
  const THREAD_ID = "<Get thread id from chat service>";
  const DISPLAY_NAME = "<Display Name>";

  return (
    <div className="welcome page">
      <div style={{ display: "flex", flexDirection: 'row', height: "100%" }}>
        <div style={{ width: '400px' }}>
          <h1 style={{ marginLeft: '15px' }}>Thread List</h1>
        </div>
        <div className="narrow">
          <ChatScreen 
            token={TOKEN}
            userId={USER_ID}
            displayName={DISPLAY_NAME}
            endpointUrl={ENDPOINT_URL}
            threadId={THREAD_ID}
            endChatHandler={function (isParticipantRemoved: boolean): void {
              console.log('End chat handler called');
            }
          }/>
        </div>
      </div>
    </div>
  );
}
