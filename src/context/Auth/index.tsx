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
  logout: (data : { unitId: string }) => void;
  getUser: (userId: string) => void;
  events: (id: string) => void;
  token: string | null;
  setAuthToken: (token: string) => void;
  setUnitIdToStorage: (unitId: string) => void;
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
  unitId: null,
  eventData: undefined,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children,navigation }:any) => {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string | null>(null);
  const [unitId, setUnitId] = useState<string | null>(null);
  const [eventData, setEventData] = useState<Event>();

  const getUser = async (unitId: string) => {
    setUnitIdToStorage(unitId)
    try {
      const toToken = `Bearer ${token}`;
      axios
        .get(baseUrl + `/unit/logon`, {
          headers: {
            Authorization: toToken,
          },
          params: {
            unitId: unitId,
          },
        })
        .then((response) => {
          setUser(response.data);
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
    const token = async() => {
      const newToken = await AsyncStorage.getItem("token");
      setToken(newToken);
    };
    token();
  },[AsyncStorage.getItem("token")]);


  useEffect(() => {
    if (token) { 
      events();
      unitId && getUser(unitId);
    }
  }, [unitId, token]);

  const login = async (username: string, password: string) => {
    try {
      return axios
        .post(baseUrl + `/token`, {
          username,
          password,
        })
        .then(async(res) => {
          const token = res.data;
          const userData = {
            username: username,
            field: password
          }
          await AsyncStorage.setItem("loggedUser", JSON.stringify(userData))
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

  const logout = async (data: { unitId: string }) => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(baseUrl + "/unit/logoff", data, header)
      .then(async(res) => {
        await AsyncStorage.removeItem("token");
        setToken(null);
        setUnitId(null);
        setUser(undefined);
      })
      .catch((err) => {
        console.log(err, "my errorr");
      });
  };

  const events = async () => {
    const toToken = `Bearer ${token}`;
    try {
      await axios
        .get(baseUrl + "/event/monitor", {
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
