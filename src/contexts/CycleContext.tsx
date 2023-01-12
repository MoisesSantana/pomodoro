import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface IContext {
  cycles: ICycle[];
  activeCycle: ICycle | undefined;
  activeCycleId: string | null;
  markCycleAsFinished: () => void;
  totalSecondsPassed: number;
  setTotalSecondsPassed: Dispatch<SetStateAction<number>>;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as IContext);

interface ICycleProviderProps {
  children: ReactNode;
}

export function CycleProvider({ children }: ICycleProviderProps) {
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [totalSecondsPassed, setTotalSecondsPassed] = useState(0);

  const activeCycle = cycles.find(({ id }) => id === activeCycleId);

  const markCycleAsFinished = () => {
    setCycles((prevState) =>
      prevState.map((cycle) => {
        if (cycle.id === activeCycleId)
          return { ...cycle, finishedDate: new Date() };
        return cycle;
      })
    );
  };

  const createNewCycle = (data: CreateCycleData) => {
    const id = String(new Date().getTime());

    const newCycle: ICycle = {
      id,
      startDate: new Date(),
      ...data,
    };

    setCycles((prevState) => [...prevState, newCycle]);
    setActiveCycleId(id);
    setTotalSecondsPassed(0);
  };

  const interruptCurrentCycle = () => {
    setCycles((prevState) =>
      prevState.map((cycle) => {
        if (cycle.id === activeCycleId)
          return { ...cycle, interruptedDate: new Date() };
        return cycle;
      })
    );

    setActiveCycleId(null);
  };

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCycleAsFinished,
        totalSecondsPassed,
        setTotalSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
