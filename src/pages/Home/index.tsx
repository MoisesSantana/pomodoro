import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import {
  StartCountdownButton,
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  TaskInput,
  StopCountdownButton,
} from "./styles";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod.number().min(5).max(60),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [totalSecondsPassed, setTotalSecondsPassed] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const activeCycle = cycles.find(({ id }) => id === activeCycleId);

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        setTotalSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate)
        );
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle]);

  const handleCreateNewCycle = (data: NewCycleFormData) => {
    const id = String(new Date().getTime());

    const newCycle: ICycle = {
      id,
      startDate: new Date(),
      ...data,
    };

    setCycles((prevState) => [...prevState, newCycle]);
    setActiveCycleId(id);
    setTotalSecondsPassed(0);

    reset();
  };

  const handleInterruptCycle = () => {
    const updatedCycles = cycles.map((cycle) => {
      if (cycle.id === activeCycleId)
        return { ...cycle, interruptedDate: new Date() };
      return cycle;
    });

    setCycles([...updatedCycles]);

    setActiveCycleId(null);
    setTotalSecondsPassed(0);
  };

  const minutesToSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
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

  const task = watch("task");
  const minutesAmount = watch("minutesAmount");
  const isDisabled = !task || !minutesAmount;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            list="task-suggestion"
            placeholder="Dê um nome para o seu projeto"
            {...register("task")}
          />

          <datalist id="task-suggestion">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register("minutesAmount", { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{firstDigitOfMin}</span>
          <span>{secondDigitOfMin}</span>
          <Separator>:</Separator>
          <span>{firstDigitOfSec}</span>
          <span>{secondDigitOfSec}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton
            onClick={() => handleInterruptCycle()}
            type="button"
          >
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
