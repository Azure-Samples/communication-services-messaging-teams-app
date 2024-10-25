import { useContext } from "react";
import { AgentScreen } from "./chat/AgentScreen";
import { TeamsFxContext } from "./Context";

export default function Tab() {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <div
      className={themeString === "default" ? "light" : themeString === "dark" ? "dark" : "contrast"}
    >
      <AgentScreen />
    </div>
  );
}
