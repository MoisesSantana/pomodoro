import { differenceInSeconds } from "date-fns";
import { useContext, useEffect } from "react";
import { CyclesContext } from "../../../../contexts/CycleContext";
import { CountdownContainer, Separator } from "./styles";

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCycleAsFinished,
    totalSecondsPassed,
    setTotalSecondsPassed,
  } = useContext(CyclesContext);

  const minutesToSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const differenceInSec = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (differenceInSec >= minutesToSeconds) {
          markCycleAsFinished();
          setTotalSecondsPassed(minutesToSeconds);
          clearInterval(interval);
        } else setTotalSecondsPassed(differenceInSec);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, minutesToSeconds, activeCycleId]);

  const currentSeconds = activeCycle
    ? minutesToSeconds - totalSecondsPassed
    : 0;

  const minutes = Math.floor(currentSeconds / 60);
  const seconds = currentSeconds % 60;

  const [firstDigitOfMin, secondDigitOfMin] = String(minutes).padStart(2, "0");
  const [firstDigitOfSec, secondDigitOfSec] = String(seconds).padStart(2, "0");

  useEffect(() => {
    if (activeCycle)
      document.title = `${firstDigitOfMin}${secondDigitOfMin}:${firstDigitOfSec}${secondDigitOfSec} - Pomodoro`;
  }, [
    firstDigitOfMin,
    secondDigitOfMin,
    firstDigitOfSec,
    secondDigitOfSec,
    activeCycle,
  ]);

  return (
    <CountdownContainer>
      <span>{firstDigitOfMin}</span>
      <span>{secondDigitOfMin}</span>
      <Separator>:</Separator>
      <span>{firstDigitOfSec}</span>
      <span>{secondDigitOfSec}</span>
    </CountdownContainer>
  );
}
