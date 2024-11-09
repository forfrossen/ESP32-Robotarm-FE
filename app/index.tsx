/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { createRoot } from "react-dom/client";
import { StoreProvider } from "./core/store";
import { theme } from "./core/theme";
import { Router } from "./routes/index";

const container = document.getElementById("root");
const root = createRoot(container!);
const queryClient = new QueryClient();

root.render(
  <CssVarsProvider theme={theme}>
    <SnackbarProvider>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <Router />
        </StoreProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  </CssVarsProvider>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => root.unmount());
}
