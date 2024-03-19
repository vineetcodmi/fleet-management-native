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
      desciption:string
    }
  | undefined;

type Event = any;

interface AuthContextType {
  user: User;
  login: (username: string, password: string) => Promise<String | undefined>;
  logout: () => void;
  getUser: (userId: string) => void;
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

  const getUser = async (unitId: string) => {
    setUnitIdToStorage(unitId)
    try {
      const toToken = `Bearer ${token}`;
      console.log(toToken, "to toknenenne");

      axios
        .get(baseUrl + `/cad/api/v2/unit/logon`, {
          headers: {
            Authorization: toToken,
          },
          params: {
            unitId: unitId,
          },
        })
        .then((response) => {
          setUser(response.data);
          console.log(response.data, "unitid");
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
      console.error("Error storing unitId in AsyncStorage:", error);
    }
  };

  const fetchUnitId = async () => {
    try {
      const storedUnitId = await AsyncStorage.getItem("unitId");
      if (storedUnitId) {
        setUnitId(storedUnitId);
      }
    } catch (error) {
      console.error("Error retrieving unitId from AsyncStorage:", error);
    }
  };
  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error retrieving token from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    fetchToken();
    fetchUnitId();
  }, []);

  useEffect(() => {
    events();
    if (token && unitId) { 
      getUser(unitId);
    }
  }, [unitId, token]);

  const login = async (username: string, password: string) => {
    try {
      return axios
        .post(baseUrl + `/cad/api/v2/token`, {
          username,
          password,
        })
        .then((res) => {
          const token = res.data;
          setAuthToken(token);
          if (unitId) {
            getUser(unitId);
          }
          return token;
        });
    } catch (error) {
      console.error("Error logging in:", error);
      return undefined;
    }
  };

  const setAuthToken = async (token: string | null) => {
    if (token) {
      try {
        await AsyncStorage.setItem("token", token);
        setToken(token);
      } catch (error) {
        console.error("Error storing token in AsyncStorage:", error);
      }
    } else {
      console.error("Token value is null or undefined");
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      // await AsyncStorage.removeItem("unitId");
      setToken(null);
      setUnitId(null);
      setUser(undefined);
      // setEventData(undefined);
    } catch (error) {
      console.error("Error removing token from AsyncStorage:", error);
    }
  };
  const deleteAccount = async (data: { unitId: string; comment: string }) => {
    axios
      .post(baseUrl + "/cad/api/v2/unit/logoff", data, header)
      .then((res) => {
        logout();
      })
      .catch((err) => {
        console.log(err, "my errorr");
      });
  };
  const events = async () => {
    console.log(token, "tokennen");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
