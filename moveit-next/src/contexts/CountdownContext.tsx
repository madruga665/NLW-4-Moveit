import { ReactNode, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
  minutes: number;
  seconds: number;
  hasFinished: boolean;
  isActive: boolean;
  startNewChallenge: () => void;
  startCountdown: () => void;
  resetCountdown: () => void;
}

interface CountdownProviderProps {
  children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider({ children }: CountdownProviderProps) {
  const {startNewChallenge} = useContext(ChallengesContext);

  const [time, setTime] = useState(0.05 * 60);
  const [isActive, setIstActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  function startCountdown() {
    setIstActive(true);

  }

  function resetCountdown () {
    clearTimeout(countdownTimeout);
    setIstActive(false);
    setTime(0.05 * 60);
    setHasFinished(false);
  }

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000)
    } else if (isActive && time === 0) {
      setHasFinished(true);
      setIstActive(false);
      startNewChallenge();
    }
  }, [isActive, time])


  return (
    <CountdownContext.Provider value={{
      minutes,
      seconds,
      hasFinished,
      isActive,
      startCountdown,
      resetCountdown,
      startNewChallenge,
    }}>
      {children}
    </CountdownContext.Provider>
  )
}