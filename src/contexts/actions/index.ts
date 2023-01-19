/* eslint-disable no-unused-vars */

import { ICycle } from "../reducers/cycles";

export enum ActionTypes {
  ADD_NEW_CYCLE = "ADD_NEW_CYCLE",
  INTERRUPT_CURRENT_CYCLE = "INTERRUPT_CURRENT_CYCLE",
  MARK_CURRENT_CYCLE_AS_FINISHED = "MARK_CURRENT_CYCLE_AS_FINISHED",
}

export const finishedCycleAction = () => ({
  type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
});

export const interruptCycleAction = () => ({
  type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
});

export const addNewCycleAction = (payload: ICycle) => ({
  type: ActionTypes.ADD_NEW_CYCLE,
  payload,
});
