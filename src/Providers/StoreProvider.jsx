import React from "react";

const StoreContext = React.createContext({
  state: {},
  setStore: Function
});

export const StoreProvider = ({ children }) => {
  const [state, setState] = React.useState({
    available_budget: 0,
    username: "",
    brandAccount: "",
  });
  return <StoreContext.Provider value={{ state, setStore: setState }}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const value = React.useContext(StoreContext);
  return value;
};
