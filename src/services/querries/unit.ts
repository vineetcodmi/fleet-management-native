import { useMutation, useQuery } from "react-query";
import { api } from "../api.ts";
import { API_ENDPOINTS } from "../../utlits/helper/apiEndpoints.ts";
import { serialize } from "../../utlits/helper/index.ts";

const { UNIT } = API_ENDPOINTS;

export function useUnitLogon() {
  return useMutation(data => {
    return api.post(UNIT.logon, data);
  });
}

export function useUnitLogoff() {
    return useMutation(data => {
      return api.post(UNIT.logoff, data);
    });
}

export function useGetUnit(id:string) {
  return useQuery(`${UNIT.unit}/${id}`, () => api.get(`${UNIT.unit}/${id}`), {
      enabled: true,
  });
}

export function useGetUnitData() {
  return useMutation((id: string) => {
    return api.get(`${UNIT.unit}/${id}`);
  });
}

export function useGetAllUnit(query?:any) {
  const queryParam = query ? serialize(query) : serialize(undefined);
  return useQuery(`${UNIT.monitor}/${queryParam}`, () => api.get(`${UNIT.monitor}${queryParam}`), {
      enabled: true,
  });
}

export function useGetAllUnitStatusCode() {
  return useQuery(`${UNIT.statuscodes}`, () => api.get(`${UNIT.statuscodes}`), {
      enabled: true,
  });
}

export function useUpdateUnitStatus() {
  return useMutation((data:any) => {
    return api.post(`${UNIT.unit}/${data?.unitId}/status`, data);
  });
}

export function useGetUnitHistory(unitId:string) {
  const querry = {
    fromDate: new Date(),
    endDate: new Date(),
    count: 10
  }
  const querryParam = serialize(querry);
  return useQuery(`${UNIT.unit}/${unitId}/history`, () => api.get(`${UNIT.unit}/${unitId}/history${querryParam}`), {
    enabled: Boolean(unitId),
  });
}

export function useGetUnitLiveLocation() {
  return useMutation((data) => {
    return api.post(`${UNIT.location}`, data);
  });
}