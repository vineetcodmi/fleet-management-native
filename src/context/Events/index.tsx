import React, {
  createContext,
  useContext,
  useState,
  FC,
  useEffect,
} from "react";
import axios from "axios";
import { baseUrl } from "../../config";
import { useAuth } from "../Auth";

type Event =
  | {
      status: any;
      description: string;
      beat: string;
    }
  | undefined;
interface EventContextType {
  unitsStatusCode: Event;
  eventStatusCode:Event;
}

const EventContext = createContext<EventContextType>({
  unitsStatusCode: undefined,
  eventStatusCode:undefined
});
export const useEvents = () => useContext(EventContext);

interface EventsProviderProps {
  children: React.ReactNode;
}

export const EventsProvider: FC<EventsProviderProps> = ({ children }) => {
  const [unitsStatusCode, setUnitsStatusCode] = useState<Event>();
  const[eventStatusCode,setEventStatusCode]=useState<Event>();
  const { token } = useAuth();
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const StatusCode = async () => {

    try {
      const response = await axios.get(
        baseUrl + "/cad/api/v2/unit/statuscodes",
        header
      );
      setUnitsStatusCode(response.data);
      console.log(response.data,"datatta of codesss");
    } catch (err) {
      console.log(err, "my errorr");
    }
  };

  const StatusCodeEvents=async()=>{
    try{
      const response =await axios.get(
        baseUrl +"/cad/api/v2/event/statuscodes",
        header
      );
      setEventStatusCode(response.data)
      }catch (err) {
        console.log(err, "my errorr");
      }
  }

  useEffect(() => {
    StatusCode();
    StatusCodeEvents();
  },[token]);
  return (
    <EventContext.Provider
      value={{
        unitsStatusCode,
        eventStatusCode
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
