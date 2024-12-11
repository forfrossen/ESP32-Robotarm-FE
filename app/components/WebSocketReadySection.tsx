import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import SyncIcon from "@mui/icons-material/Sync";
import { Button } from "@mui/joy";
import { ReadyState } from "react-use-websocket";
import { StyledBox } from "../routes/styles";

type WebSocketReadySectionProps = {
  readyState: ReadyState;
};
export const WebSocketReadySection = function WebSocketReadySection({
  readyState,
}: WebSocketReadySectionProps): JSX.Element {
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const getReadyStateIcon = () => {
    switch (readyState) {
      case WebSocket.CONNECTING:
        return <SyncIcon color="warning" />;
      case WebSocket.OPEN:
        return <LinkIcon color="success" />;
      case WebSocket.CLOSING:
        return <SyncIcon color="warning" />;
      case WebSocket.CLOSED:
        return <LinkOffIcon color="error" />;
      default:
        return <LinkOffIcon />;
    }
  };
  return (
    <StyledBox>
      <Button onClick={() => {}} disabled={readyState == WebSocket.OPEN}>
        Connect
      </Button>
      Connection Status: {getReadyStateIcon()} {connectionStatus}
    </StyledBox>
  );
};
