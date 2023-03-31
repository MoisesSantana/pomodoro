import { ICyclesState } from '../contexts/reducers/cycles'

export const persistCycle = (cycles: ICyclesState) => {
  const stateJSON = JSON.stringify(cycles)
  localStorage.setItem('@pomodoro:cycles-state', stateJSON)
}
