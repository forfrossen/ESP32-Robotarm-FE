import { Card, CardContent } from "@mui/joy";
import { CardHeader } from "@mui/material";
import { useAtom } from "jotai";
import { jsonRpcMultiResponseAtomFamily } from "../store/atoms";

type Props = {
  id: number;
};

export const JsonRpcComponent = ({ id }: Props) => {
  const [message] = useAtom(jsonRpcMultiResponseAtomFamily(id));
  return (
    <Card sx={{ margin: "1.2rem" }}>
      <CardHeader title={"Message"} />
      <CardContent>
        <pre>{JSON.stringify(message, null, 2)}</pre>
      </CardContent>
    </Card>
  );
};
