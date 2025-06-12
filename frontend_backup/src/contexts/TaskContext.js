import React, { createContext, useContext } from 'react';

const TaskContext = createContext({
  tasks: [],
  addTask: () => {},
});

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  return (
    <TaskContext.Provider value={{ tasks: [], addTask: () => {} }}>
      {children}
    </TaskContext.Provider>
  );
};
