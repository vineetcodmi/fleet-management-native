import { api } from "../api.ts";
import { API_ENDPOINTS } from "../../utlits/helper/apiEndpoints.ts";
import { useMutation, useQuery } from "react-query";
import { serialize } from "../../utlits/helper/index.ts";

const { EVENT } = API_ENDPOINTS;

type DataProps  = {
  id: string,
  data: any
}

export function useGetEvent(id: string | undefined) {
  return useQuery(`${EVENT.event}/${id}`, () => api.get(`${EVENT.event}/${id}`), {
      enabled: Boolean(id),
  });
}

export function useGetEventData() {
  return useMutation((id:string) => {
    return api.get(`${EVENT.event}/${id}`);
  });
}

export function useGetAllEvent(query?:any) {
  const queryParam = query ? serialize(query) : serialize(undefined);
  return useQuery(`${EVENT.monitor}/${queryParam}`, () => api.get(`${EVENT.monitor}${queryParam}`), {
      enabled: true,
  });
}

export function useGetEventTypes() {
  return useQuery(EVENT.eventTypes, () => api.get(EVENT.eventTypes), {
      enabled: true,
  });
}

export function useCreateEvent() {
  return useMutation(data => {
    return api.post(EVENT.createEvent, data);
  });
}

export function useGetAllEventStatusCode() {
  return useQuery(`${EVENT.statuscodes}`, () => api.get(`${EVENT.statuscodes}`), {
      enabled: true,
  });
}

export function useAddComment() {
  return useMutation(({id, data}: DataProps) => {
    return api.post(`${EVENT.event}/${id}${EVENT.addComment}`, data);
  });
}

export function useUpdateEvent() {
  return useMutation(({id, data}: DataProps) => {
    return api.post(`${EVENT.event}/${id}${EVENT.update}`, data);
  });
}

