import axios from "axios";
import { baseUrl } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create();
let createTokenPromise:any = null; 

// request interceptor method:
api.interceptors.request.use(
  async function (config) {
    config.baseURL = baseUrl;
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// response interceptor method:
api.interceptors.response.use(
  function (res) {
    return res.data;
  },
  async function (error) {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("k");
      
      originalRequest._retry = true;
      try {
        const user:any = await AsyncStorage.getItem("loggedUser");
        const userDetail = JSON.parse(user);
        // If createTokenPromise is null or resolved, start a new createToken API call
        if (!createTokenPromise || createTokenPromise.resolved) {
          const userdata = {
            username: userDetail?.username,
            password: userDetail?.field
          }
          createTokenPromise = axios.post("https://mrrajdev.hexagon.com/cad/api/v2/token", userdata).then((res) => {
            return {
              newToken: res.data,
              resolved: true
            };
          });
        }

        // Wait for the createTokenPromise to resolve
        const { newToken } = await createTokenPromise;

        // Save the new token to localStorage
        await AsyncStorage.setItem("token", newToken);

        // Update Authorization header with the new token
        originalRequest.headers.Authorization = "Bearer " + newToken;

        // Retry the original request
        return api(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export { api };