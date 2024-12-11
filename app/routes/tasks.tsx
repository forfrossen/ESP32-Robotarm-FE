/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Container, Typography } from "@mui/joy";
import { useAtom } from "jotai";
import { usePageEffect } from "../core/page";

import { apiInfoAtom } from "../store/atoms";
import { StyledBox } from "./styles";

export const Component = function Tasks(): JSX.Element {
  usePageEffect({ title: "Tasks" });
  const [apiInfoQuery] = useAtom(apiInfoAtom);

  // const parsed =
  //   apiInfoQuery.isSuccess && openapiTS(apiInfoQuery.data as string);

  // console.log(parsed);

  // const schemas = apiInfoQuery.isSuccess
  //   ? apiInfoQuery?.data?.components.schemas
  //   : {};

  // const commandNames = Object.keys(schemas);

  // const getCommandParameters = (commandName) => {
  //   const commandSchema = schemas[commandName];
  //   const requiredParams = commandSchema.required || [];
  //   const properties = commandSchema.properties || {};

  //   const paramNames = requiredParams.filter((param) => param !== "method");
  //   const params = paramNames.map((paramName) => {
  //     const paramSchema = properties[paramName];
  //     return {
  //       name: paramName,
  //       type: paramSchema.type,
  //       format: paramSchema.format,
  //     };
  //   });

  //   return params;
  // };

  //   return params;
  // };

  // const params = getCommandParameters("SET_WORKING_CURRENT");
  // console.log(params);

  return (
    <Container sx={{ py: 2 }}>
      <Typography level="h2" gutterBottom>
        Tasks
      </Typography>

      <StyledBox>
        {apiInfoQuery.isLoading && <Typography>Loading...</Typography>}
        {apiInfoQuery.isError && (
          <Typography color="danger">{String(apiInfoQuery.error)}</Typography>
        )}
        {apiInfoQuery.isSuccess && !!apiInfoQuery.data && (
          <>
            <h1>Api Info:</h1>
            <pre>{JSON.stringify(apiInfoQuery.data, null, 2)}</pre>
          </>
        )}
      </StyledBox>
    </Container>
  );
};
