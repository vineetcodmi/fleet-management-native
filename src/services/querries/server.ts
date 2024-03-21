import { api } from "../api.ts";
import { useMutation } from "react-query";

export function useValidateConfigureServer() {
  return useMutation(url => {
    return api.get(`${url}`);
  });
}