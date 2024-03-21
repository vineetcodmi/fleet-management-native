import { useMutation } from "react-query";
import { api } from "../api.ts";
import { API_ENDPOINTS } from "../../utlits/helper/apiEndpoints.ts";

const { TOKEN } = API_ENDPOINTS;

export function useCreateToken() {
  return useMutation(data => {
    return api.post(TOKEN.token, data);
  });
}