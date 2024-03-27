import React, {
  createContext,
  useContext,
  useState,
  FC,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../../config";

type User =
  | {
      unitId: string;
      assignedAgencyEventId: string;
      status: number;
      beat:string;
      desciption:string;
      latitude: number;
      longitude: number;
      dispatchGroup: string;
    }
  | undefined;

type Event = any;

interface AuthContextType {
  user: User;
  login: (username: string, password: string, unitId: string) => Promise<String | undefined>;
  logout: () => void;
  getUser: (userId: any, token:any) => void;
  events: () => void;
  token: string | null;
  setAuthToken: (token: string) => void;
  setUnitIdToStorage: (unitId: string) => void;
  deleteAccount: (data: { unitId: string; comment: string }) => void;
  eventData: Event;
  unitId: string | null;
  fetchToken: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  login: async () => undefined,
  logout: () => {},
  getUser: () => {},
  events: async () => undefined,
  token: null,
  setAuthToken: () => {},
  setUnitIdToStorage: () => {},
  deleteAccount: () => {},
  unitId: null,
  eventData: undefined,
  fetchToken: () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string | null>(null);
  const [unitId, setUnitId] = useState<string | null>(null);
  const [eventData, setEventData] = useState<Event>();
  const [loginUser, setLoginUser] = useState<Event>();

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getUser = async (unitId: any, token: any) => {
    console.log(unitId, token, baseUrl + `/cad/api/v2/unit/logon`, "unitId");
    
    setUnitIdToStorage(unitId)
    try {
      const header = {
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }
      const data  = {
        unitId: unitId
      }
      return axios
        .post(baseUrl + `/cad/api/v2/unit/logon`, data, header)
        .then(async(response) => {
          setUser(response.data);
          await AsyncStorage.setItem("user", JSON.stringify(response.data))
          return response?.data
        })
        .catch((error) => {
          console.log(error, "Error fetching user data");
        });
    } catch (e) {
      console.log(e, "Error fetching user data");
    }
  };

  const setUnitIdToStorage = async (unitId: string) => {
    try {
      await AsyncStorage.setItem("unitId", unitId);
      setUnitId(unitId);
    } catch (error) {
      // console.error("Error storing unitId in AsyncStorage:", error);
    }
  };

  const fetchUnitId = async () => {
    try {
      const storedUnitId = await AsyncStorage.getItem("unitId");
      const storedToken = await AsyncStorage.getItem("token");
      console.log(storedToken, storedUnitId);
      
      if (storedUnitId) {
        setUnitId(storedUnitId);
        getUser(storedUnitId,storedToken)
      }
    } catch (error) {
      // console.error("Error retrieving unitId from AsyncStorage:", error);
    }
  };

  const fetchToken = async () => {
    try {
      const data = await AsyncStorage.getItem("loggedUserInfo");
      const userData = JSON.parse(data || "");
      
      return await axios
        .post(baseUrl + `/cad/api/v2/token`, userData)
        .then(async(res) => {
          console.log(res?.data, "token fetched");
          const token = res?.data;
          setAuthToken(token);
          setToken(token);
          await AsyncStorage.setItem("token", token || "");
          console.log(token, "token");
          return token;
        }).catch((err: any) => {
          console.log(err, "Error in token fetching");
        });
    } catch (error) {
      // console.error("Error retrieving token from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    // if(token && loginUser){
      console.log("fetching");
      fetchToken();      
      const interval = setInterval(fetchToken, 30000);
      return () => clearInterval(interval);
    // }
  }, []);

  useEffect(() => {
    fetchToken();
    fetchUnitId();
  }, []);

  // useEffect(() => {
  //   const fetchUser = async() => {
  //     const user = await AsyncStorage.getItem("user");
  //     const userData =  JSON.parse(user);
  //   }
  // },[])

  // console.log(unitId, "kk");
  

  // useEffect(() => {
  //   if (token) { 
  //     events();
  //   }
  // }, [unitId, token]);

  const login = async (username: string, password: string, unitId: string) => {
    console.log("in token creation", password);
    
    try {
      return axios
        .post(baseUrl + `/cad/api/v2/token`, {
          username,
          password,
        })
        .then(async(res) => {
          console.log(res,"jj");
          
          const token = res.data;
          const userInfo = {
            username,
            password
          };
          await AsyncStorage.setItem("loggedUserInfo", JSON.stringify(userInfo));
          const user = await getUser(unitId, token);
          if(user){
            setToken(token);
            setAuthToken(token);
            return token;
          } else {
            return null
          }
        });
    } catch (error) {
      // console.error("Error logging in:", error);
      return undefined;
    }
  };

  const setAuthToken = async (token: string | null) => {
    if (token) {
      try {
        await AsyncStorage.setItem("token", token);
        setToken(token);
      } catch (error) {
        // console.error("Error storing token in AsyncStorage:", error);
      }
    } else {
      // console.error("Token value is null or undefined");
    }
  };

  const logout = async () => {
    console.log("ii", unitId);
    
    try {
      axios
      .post(baseUrl + "/cad/api/v2/unit/logoff", {unitId: unitId}, header)
      .then(async(res) => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("loggedUserInfo")
        await AsyncStorage.removeItem("unitId");
        await AsyncStorage.removeItem("user");
        setToken(null);
        setUnitId(null);
        setUser(undefined);
      })
      .catch((err) => {
        console.log(err, "my errorr");
      });

      // setEventData(undefined);
    } catch (error) {
      // console.error("Error removing token from AsyncStorage:", error);
    }
  };
  const deleteAccount = async (data: { unitId: string; comment: string }) => {
    // axios
    //   .post(baseUrl + "/cad/api/v2/unit/logoff", data, header)
    //   .then((res) => {
    //     logout();
    //   })
    //   .catch((err) => {
    //     console.log(err, "my errorr");
    //   });
  };
  const events = async () => {
    const toToken = `Bearer ${token}`;
    console.log(token, "jj");
    
    try {
      await axios
        .get(baseUrl + "/cad/api/v2/event/monitor" + `?dispatchGroup=${user?.dispatchGroup}`, {
          headers: {
            Authorization: toToken,
          },
        })
        .then((res:any) => {
          console.log(res, res?.data, "my event data");
          setEventData(res.data);
        });
    } catch (error) {
      console.log("error eventsss", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        token,
        getUser,
        setAuthToken,
        deleteAccount,
        unitId,
        setUnitIdToStorage,
        events,
        eventData,
        fetchToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
