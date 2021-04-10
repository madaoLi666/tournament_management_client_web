import React, { useContext, useState } from 'react';

const CurrentContext = React.createContext(0);
const ChangeCurrentContext = React.createContext((value: number) => null);

export function useCurrent() {
  return useContext(CurrentContext);
}

export function useChangeCurrent() {
  return useContext(ChangeCurrentContext);
}

export function CurrentProvider(props: any) {
  const { children } = props;
  const [current, setCurrent] = useState(0);

  function changeCurrent(value: number): null {
    setCurrent(value);
    return null;
  }

  return (
    <CurrentContext.Provider value={current}>
      <ChangeCurrentContext.Provider value={changeCurrent}>
        {children}
      </ChangeCurrentContext.Provider>
    </CurrentContext.Provider>
  );
}
