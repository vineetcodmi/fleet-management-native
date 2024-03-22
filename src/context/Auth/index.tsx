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
    }
  | undefined;

type Event = any;

interface AuthContextType {
  user: User;
  login: (username: string, password: string, unitId: string) => Promise<String | undefined>;
  logout: () => void;
  getUser: (userId: any, token:any) => void;
  events: (id: string) => void;
  token: string | null;
  setAuthToken: (token: string) => void;
  setUnitIdToStorage: (unitId: string) => void;
  deleteAccount: (data: { unitId: string; comment: string }) => void;
  eventData: Event;
  unitId: string | null;
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
      axios
        .post(baseUrl + `/cad/api/v2/unit/logon`, data, header)
        .then((response) => {
          setUser(response.data);
          console.log(response.data, "data  ===>");
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
      if (storedUnitId) {
        setUnitId(storedUnitId);
      }
    } catch (error) {
      // console.error("Error retrieving unitId from AsyncStorage:", error);
    }
  };
  const fetchToken = async () => {
    try {
      if(token){
        const storedUser = await AsyncStorage.getItem("loggedUserInfo");
        if(storedUser){
          const userData = JSON.parse(storedUser || "");
          console.log(userData, "kk");
          await axios
            .post(baseUrl + `/cad/api/v2/token`, {
              username: userData?.username,
              password: userData?.field,
            })
            .then(async(res) => {
              const token = res.data;
              setAuthToken(token);
              setToken(token);
              return token;
            });
        }
      }
    } catch (error) {
      // console.error("Error retrieving token from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    fetchToken();
    const interval = setInterval(fetchToken, 60000); // Fetch token every minute (60 * 1000 milliseconds)

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    // fetchToken();
    fetchUnitId();
  }, []);

  // console.log(unitId, "kk");
  

  useEffect(() => {
    if (token) { 
      events();
      // unitId && getUser(unitId);
    }
  }, [unitId, token]);

  const login = async (username: string, password: string, unitId: string) => {
    console.log("in token creation");
    
    try {
      return axios
        .post(baseUrl + `/cad/api/v2/token`, {
          username,
          password,
        })
        .then(async(res) => {
          const token = res.data;
          setAuthToken(token);
          const userInfo = JSON.stringify({
            username: username,
            field: password
          });
          await AsyncStorage.setItem("loggedUserInfo", userInfo);
          setToken(token);
          getUser(unitId, token);
          return token;
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
    try {
      axios
      .post(baseUrl + "/cad/api/v2/unit/logoff", {unitId: unitId}, header)
      .then(async(res) => {
        console.log("Logged Off");
        
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("loggedUserInfo")
        // await AsyncStorage.removeItem("unitId");
        setToken(null);
        setUnitId(null);
        setUser(undefined);
      })
      .catch((err) => {
        // console.log(err, "my errorr");
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
    try {
      await axios
        .get(baseUrl + "/cad/api/v2/event/monitor", {
          headers: {
            Authorization: toToken,
          },
        })
        .then((res) => {
          setEventData(res.data);
        });
    } catch (error) {
      // console.log("error eventsss", error);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
