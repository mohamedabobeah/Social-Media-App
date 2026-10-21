import { createContext, useState, type ReactNode } from "react";

interface CounterContextType {
  counter: number;
  setcounter: React.Dispatch<React.SetStateAction<number>>;
  sayHello: () => void;
}

export const CounterContext = createContext<CounterContextType | undefined>(
  undefined
);

export default function CounterContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [counter, setcounter] = useState<number>(0);

  function sayHello() {
    console.log("hello");
  }

  return (
    <CounterContext.Provider value={{ counter, setcounter, sayHello }}>
      {children}
    </CounterContext.Provider>
  );
}
