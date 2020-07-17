import React, { createContext } from 'react';
import { ability } from '@caesar/common/ability';

export const AbilityContext = createContext();

export const AbilityProvider = ({ children }) => (
  <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
);
