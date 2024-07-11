
import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [editId, setEditId] = useState(null);

  return (
    <FormContext.Provider value={{ editId, setEditId }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => useContext(FormContext);
