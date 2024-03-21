import React, {
  createContext,
  useContext,
  useState,
  FC,
  useEffect,
} from "react";
import { useGetAllUnitStatusCode } from "../../services/querries/unit";
import { useGetAllEventStatusCode } from "../../services/querries/event";
import { AxiosResponse } from "axios";

type Event =
  | {
      status: any;
      description: string;
      beat: string;
    }
  | undefined;
interface EventContextType {
  unitsStatusCode: Event | AxiosResponse;
  eventStatusCode: Event | AxiosResponse;
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
  const [unitsStatusCode, setUnitsStatusCode] = useState<Event | AxiosResponse>();
  const[eventStatusCode,setEventStatusCode]=useState<Event | AxiosResponse>();
  const { data: unitStatusCodes } = useGetAllUnitStatusCode();
  const { data: eventStatusCodes } = useGetAllEventStatusCode();

  useEffect(() => {
    if(unitStatusCodes){
      setUnitsStatusCode(unitStatusCodes)
    }
  },[unitStatusCodes])

  useEffect(() => {
    if(eventStatusCodes){
      setEventStatusCode(eventStatusCodes)
    }
  },[eventStatusCodes]);

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
