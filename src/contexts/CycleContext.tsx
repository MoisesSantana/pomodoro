import { differenceInSeconds } from 'date-fns'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { persistCycle } from '../services/storage'
import {
  addNewCycleAction,
  finishedCycleAction,
  interruptCycleAction,
} from './actions'
import { cyclesReducer, ICycle } from './reducers/cycles'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface IContext {
  cycles: ICycle[]
  activeCycle: ICycle | undefined
  activeCycleId: string | null
  markCycleAsFinished: () => void
  totalSecondsPassed: number
  setTotalSecondsPassed: Dispatch<SetStateAction<number>>
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as IContext)

interface ICycleProviderProps {
  children: ReactNode
}

const INITIAL_CYCLES_STATE = { cycles: [], activeCycleId: null }

export function CycleProvider({ children }: ICycleProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    INITIAL_CYCLES_STATE,
    () => {
      const storedStateAsJSON = localStorage.getItem('@pomodoro:cycles-state')
      if (storedStateAsJSON) return JSON.parse(storedStateAsJSON)
      else return INITIAL_CYCLES_STATE
    },
  )
  console.log(cyclesState)
  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find(({ id }) => id === activeCycleId)

  const [totalSecondsPassed, setTotalSecondsPassed] = useState(() => {
    if (activeCycle)
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))

    return 0
  })

  useEffect(() => {
    persistCycle(cyclesState)
  }, [cyclesState])

  const markCycleAsFinished = () => {
    dispatch(finishedCycleAction())
  }

  const createNewCycle = (data: CreateCycleData) => {
    const id = String(new Date().getTime())

    const newCycle: ICycle = {
      id,
      startDate: new Date(),
      ...data,
    }

    dispatch(addNewCycleAction(newCycle))
    setTotalSecondsPassed(0)
  }

  const interruptCurrentCycle = () => {
    dispatch(interruptCycleAction())
  }

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
  )
}
