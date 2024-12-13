'use client';

// contexts/MMContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { evaluate, format, fraction } from 'mathjs';
import { 
  isValidPositiveInteger, 
  isValidPositiveNumber 
} from '@/lib/math';
import { 
  getFromLocalStorage, 
  saveToLocalStorage 
} from '@/utils/localstorage';

// Keys for localStorage
export const MM_STORAGE_KEYS = {
  SERVERS: 'mm-servers',
  CAPACITY: 'mm-capacity',
  SERVICE_RATE: 'mm-serviceRate',
  ARRIVAL_RATE: 'mm-arrivalRate',
  SIMULATIONS: 'mm-simulations'
};

// Interface for MM Context State
interface MMContextType {
  servers: string;
  setServers: (value: string) => void;
  capacity: string;
  setCapacity: (value: string) => void;
  arrivalRate: string;
  setArrivalRate: (value: string) => void;
  serviceRate: string;
  setServiceRate: (value: string) => void;
  arrivalTime: string;
  setArrivalTime: (value: string) => void;
  serviceTime: string;
  setServiceTime: (value: string) => void;
  simulations: string;
  setSimulations: (value: string) => void;
}

// Create Context
const MMContext = createContext<MMContextType | undefined>(undefined);

// Provider Component
export const MMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [servers, setServers] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [arrivalRate, setArrivalRate] = useState<string>("");
  const [serviceRate, setServiceRate] = useState<string>("");
  const [arrivalTime, setArrivalTime] = useState<string>("");
  const [serviceTime, setServiceTime] = useState<string>("");
  const [simulations, setSimulations] = useState<string>("");

  // Load from localStorage on initial mount
  useEffect(() => {
    const loadStoredValues = () => {
      // Servers
      const savedServers = getFromLocalStorage(MM_STORAGE_KEYS.SERVERS, "");
      const evaluatedServers = evaluate(savedServers + "");
      if (isValidPositiveInteger(evaluatedServers)) {
        setServers(evaluatedServers);
      }

      // Capacity
      const savedCapacity = getFromLocalStorage(MM_STORAGE_KEYS.CAPACITY, "");
      const evaluatedCapacity = evaluate(savedCapacity);
      if (isValidPositiveInteger(evaluatedCapacity)) {
        setCapacity(evaluatedCapacity);
      }

      // Service Rate
      const savedServiceRate = getFromLocalStorage(MM_STORAGE_KEYS.SERVICE_RATE, "");
      const evaluatedServiceRate = evaluate(savedServiceRate + "");
      if (isValidPositiveNumber(evaluatedServiceRate)) {
        const formattedServiceRate = Number.isInteger(evaluatedServiceRate)
          ? evaluatedServiceRate
          : format(fraction(evaluatedServiceRate), { fraction: "ratio" });
        
        setServiceRate(formattedServiceRate);
        
        const calculatedServiceTime = 1 / evaluatedServiceRate;
        setServiceTime(
          Number.isInteger(calculatedServiceTime)
            ? calculatedServiceTime.toString()
            : format(fraction(calculatedServiceTime), { fraction: "ratio" })
        );
      }

      // Arrival Rate
      const savedArrivalRate = getFromLocalStorage(MM_STORAGE_KEYS.ARRIVAL_RATE, "");
      const evaluatedArrivalRate = evaluate(savedArrivalRate + "");
      if (isValidPositiveNumber(evaluatedArrivalRate)) {
        const formattedArrivalRate = Number.isInteger(evaluatedArrivalRate)
          ? evaluatedArrivalRate
          : format(fraction(evaluatedArrivalRate), { fraction: "ratio" });
        
        setArrivalRate(formattedArrivalRate);
        
        const calculatedArrivalTime = 1 / evaluatedArrivalRate;
        setArrivalTime(
          Number.isInteger(calculatedArrivalTime)
            ? calculatedArrivalTime.toString()
            : format(fraction(calculatedArrivalTime), { fraction: "ratio" })
        );
      }

      // Simulations
      const savedSimulations = getFromLocalStorage(MM_STORAGE_KEYS.SIMULATIONS, "");
      const evaluatedSimulations = evaluate(savedSimulations);
      if (isValidPositiveInteger(evaluatedSimulations)) {
        setSimulations(evaluatedSimulations);
      }
    };

    loadStoredValues();
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    saveToLocalStorage(MM_STORAGE_KEYS.SERVERS, servers);
  }, [servers]);

  useEffect(() => {
    saveToLocalStorage(MM_STORAGE_KEYS.CAPACITY, capacity);
  }, [capacity]);

  useEffect(() => {
    saveToLocalStorage(MM_STORAGE_KEYS.ARRIVAL_RATE, arrivalRate);
  }, [arrivalRate]);

  useEffect(() => {
    saveToLocalStorage(MM_STORAGE_KEYS.SERVICE_RATE, serviceRate);
  }, [serviceRate]);

  useEffect(() => {
    saveToLocalStorage(MM_STORAGE_KEYS.SIMULATIONS, simulations);
  }, [simulations]);

  // Context value
  const contextValue = {
    servers,
    setServers,
    capacity,
    setCapacity,
    arrivalRate,
    setArrivalRate,
    serviceRate,
    setServiceRate,
    arrivalTime,
    setArrivalTime,
    serviceTime,
    setServiceTime,
    simulations,
    setSimulations
  };

  return (
    <MMContext.Provider value={contextValue}>
      {children}
    </MMContext.Provider>
  );
};

// Custom Hook
export const useMM = () => {
  const context = useContext(MMContext);
  if (context === undefined) {
    throw new Error('useMM must be used within an MMProvider');
  }
  return context;
};