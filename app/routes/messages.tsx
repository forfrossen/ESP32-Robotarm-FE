/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import SyncIcon from "@mui/icons-material/Sync";
import { Button, Container, Input, Typography } from "@mui/joy";
import { useState } from "react";
import { ReadyState } from "react-use-websocket";
import { usePageEffect } from "../core/page";
import { CommandType } from "../robot-arm/types";
import { useJsonRpcClient } from "../robot-arm/useWebsocket";
import { StyledBox } from "./styles";

const runlevels = [0, 1, 2, 3];

export const Component = function Messages(): React.FC {
  usePageEffect({ title: "Messages" });
  const [customMessage, setCustomMessage] = useState("");

  const { messageHistory, readyState, sendRpc } = useJsonRpcClient();

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

  const sendStartCommand = () => {
    return sendRpc(CommandType.START);
  };

  const sendStopCommand = () => {
    return sendRpc(CommandType.STOP);
  };

  function sendSetRunlevelCommand(runlevel: number) {
    return sendRpc(CommandType.SET_RUNLEVEL, { runlevel });
  }

  return (
    <Container
      sx={{
        py: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography level="h2" gutterBottom>
        Messages
      </Typography>
      <StyledBox>
        <Button onClick={() => {}} disabled={readyState == WebSocket.OPEN}>
          Connect
        </Button>
        Connection Status: {getReadyStateIcon()} {connectionStatus}
      </StyledBox>
      <StyledBox>
        <Button onClick={() => sendStartCommand()}>Start Motors</Button>
        <Button onClick={() => sendStopCommand()}>Stop Motors</Button>
      </StyledBox>
      <StyledBox>
        {runlevels.map((i) => (
          <RunLevelButton
            key={i}
            runlevel={i}
            onClick={() => sendSetRunlevelCommand(i)}
          />
        ))}
      </StyledBox>
      <StyledBox>
        <Button onClick={() => sendRpc(CommandType.EMERGENCY_STOP, undefined)}>
          EMERGENCY_STOP
        </Button>
      </StyledBox>
      <StyledBox>
        <MyInput value={customMessage} onChange={setCustomMessage} />
        {/* <Button
          disabled={customMessage.length < 1}
          onClick={() => sendMessage(customMessage)}
        >
          Send
        </Button> */}
      </StyledBox>
      <StyledBox>
        <ul>
          {messageHistory.map((message, index) => (
            <li key={index}>{message ? message.jsonrpc : null}</li>
          ))}
        </ul>
      </StyledBox>
    </Container>
  );
};

type Props = {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};
const MyInput = ({ value, onChange }: Props) => {
  return (
    <Input
      fullWidth={false}
      placeholder="Type a message..."
      onChange={(e) => onChange(e.target.value)}
      value={value}
    />
  );
};

const RunLevelButton = ({
  runlevel,
  onClick,
}: {
  runlevel: number;
  onClick: () => void;
}) => {
  return <Button onClick={onClick}>Set Runlevel {runlevel}</Button>;
};
