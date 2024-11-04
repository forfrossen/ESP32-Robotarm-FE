export const headers = new Headers();

headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");

export type CreateClientIdResponse = {
  client_id: string;
};
export const controllerAddress = "192.168.178.36";
export const controllerWsUrl = `ws://${controllerAddress}/ws`;

export const systemApi = () => {
  const baseUrl = `http://${controllerAddress}`;
  const createNewClientId = async (): Promise<CreateClientIdResponse> => {
    console.log("[DEBUG] createNewClientId");
    return await fetch(`${baseUrl}/new_client`, {
      method: "GET",
      headers: headers,
    }).then((response) => response.json());
  };

  return { createNewClientId };
};
