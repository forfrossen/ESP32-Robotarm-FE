/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */
import { Box, Button, Container, Typography } from "@mui/joy";
import { useAtom } from "jotai";
import { WebSocketReadySection } from "../components/WebSocketReadySection";
import { usePageEffect } from "../core/page";
import { JsonRpcComponent } from "../robot-arm/JsonRpcComponent";
import { CommandType } from "../robot-arm/types/jsonRrpcMethods.types";
import { useJsonRpcClient } from "../robot-arm/useWebsocket";
import { nextRequestIdAtom } from "../store/atoms";
import { StyledBox } from "./styles";

const runlevels = [0, 1, 2, 3];

export const Component = function Messages(): JSX.Element {
  usePageEffect({ title: "Messages" });
  const [latestMessageId] = useAtom(nextRequestIdAtom);
  const allMessageIds = Array.from(new Array(latestMessageId), (_, i) => i);

  const { readyState, sendRpc } = useJsonRpcClient();

  const sendStartCommand = () => {
    return sendRpc(CommandType.START);
  };

  const sendStopCommand = () => {
    return sendRpc(CommandType.STOP);
  };

  function sendSetRunlevelCommand(runlevel: number) {
    return sendRpc(CommandType.SET_RUNLEVEL, { motor_id: 2, runlevel });
  }

  function moveMotor() {
    return sendRpc(CommandType.RUN_MOTOR_RELATIVE_MOTION_BY_AXIS, {
      motor_id: 2,
      position: 180,
      speed: 1000,
      acceleration: 2,
      direction: true,
    });
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
      <WebSocketReadySection readyState={readyState} />
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
        <Button
          color={"danger"}
          onClick={() => sendRpc(CommandType.EMERGENCY_STOP, undefined)}
        >
          EMERGENCY_STOP
        </Button>
      </StyledBox>
      <StyledBox>
        <Button onClick={() => moveMotor()}>Move Motor</Button>
      </StyledBox>

      <Container>
        <>
          <Box>
            Number of JsonRpc2.0 Messages: {allMessageIds.length} | Latest
            Message ID: {latestMessageId}
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-evenly"}
            flexWrap={"wrap"}
          >
            {allMessageIds.map((id) => (
              <JsonRpcComponent key={id} id={id} />
            ))}
          </Box>
        </>
      </Container>
    </Container>
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
