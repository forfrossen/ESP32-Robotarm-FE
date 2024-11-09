import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import * as yaml from "js-yaml";
import { apiInfoAtom } from "../store";
import { useSystemApi } from "./systemApi";

export const useApiInfo = () => {
  const { getApiInfo } = useSystemApi();
  const parseApiInfo = (apiInfo: string) => yaml.load(apiInfo);

  const apiInfoQuery = useQuery({
    queryKey: ["openApiConfig"],
    queryFn: () => {
      return getApiInfo();
      // .then((data) => {
      //   return parseApiInfo(data);
      // });
    },
    retry: 0,
  });

  return { apiInfoQuery, apiInfo: apiInfoAtom };
};

const [{ data, isPending, isError }] = useAtom(apiInfoAtom);
