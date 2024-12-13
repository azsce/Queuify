"use client";

// contexts/DD1KContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { evaluate, format, fraction } from "mathjs";
import { isValidPositiveInteger, isValidPositiveNumber } from "@/lib/math";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localstorage";

// Keys for localStorage
export const DD1K_STORAGE_KEYS = {
  CAPACITY: "dd1k-capacity",
  SERVICE_RATE: "dd1k-serviceRate",
  ARRIVAL_RATE: "dd1k-arrivalRate",
  INITIAL_CUSTOMERS: "dd1k-initialCustomers",
};

// Interface for DD1K Context State
interface DD1KContextType {
  capacity: string;
  setCapacity: (value: string) => void;
  buffer: string;
  setBuffer: (value: string) => void;
  arrivalRate: string;
  setArrivalRate: (value: string) => void;
  serviceRate: string;
  setServiceRate: (value: string) => void;
  initialCustomers: string;
  setInitialCustomers: (value: string) => void;
  arrivalTime: string;
  setArrivalTime: (value: string) => void;
  serviceTime: string;
  setServiceTime: (value: string) => void;
  isInitialCustomersRequired: boolean;
}

// Create Context
const DD1KContext = createContext<DD1KContextType | undefined>(undefined);

// Provider Component
export const DD1KProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [capacity, setCapacity] = useState<string>("");
  const [buffer, setBuffer] = useState<string>("");
  const [arrivalRate, setArrivalRate] = useState<string>("");
  const [serviceRate, setServiceRate] = useState<string>("");
  const [initialCustomers, setInitialCustomers] = useState<string>("");
  const [arrivalTime, setArrivalTime] = useState<string>("");
  const [serviceTime, setServiceTime] = useState<string>("");
  const [isInitialCustomersRequired, setIsInitialCustomersRequired] =
    useState(false);

  // Load from localStorage on initial mount
  useEffect(() => {
    const loadStoredValues = () => {
      // Service Rate
      const savedServiceRate = getFromLocalStorage(
        DD1K_STORAGE_KEYS.SERVICE_RATE,
        ""
      );
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
      const savedArrivalRate = getFromLocalStorage(
        DD1K_STORAGE_KEYS.ARRIVAL_RATE,
        ""
      );
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

      // Capacity
      const savedCapacity = getFromLocalStorage(DD1K_STORAGE_KEYS.CAPACITY, "");
      const evaluatedCapacity = evaluate(savedCapacity);
      if (isValidPositiveInteger(evaluatedCapacity)) {
        setCapacity(evaluatedCapacity);
        setBuffer((evaluatedCapacity - 1).toString());
      }

      // Initial Customers
      const savedInitialCustomers = getFromLocalStorage(
        DD1K_STORAGE_KEYS.INITIAL_CUSTOMERS,
        ""
      );
      const evaluatedInitialCustomers = evaluate(savedInitialCustomers + "");
      if (isValidPositiveInteger(evaluatedInitialCustomers)) {
        setInitialCustomers(evaluatedInitialCustomers);
      }

      // Determine if Initial Customers are Required
      if (
        evaluatedArrivalRate &&
        evaluatedServiceRate &&
        evaluatedArrivalRate <= evaluatedServiceRate
      ) {
        setIsInitialCustomersRequired(true);
      }
    };

    loadStoredValues();
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    saveToLocalStorage(DD1K_STORAGE_KEYS.CAPACITY, capacity);
  }, [capacity]);

  useEffect(() => {
    saveToLocalStorage(DD1K_STORAGE_KEYS.ARRIVAL_RATE, arrivalRate);
  }, [arrivalRate]);

  useEffect(() => {
    saveToLocalStorage(DD1K_STORAGE_KEYS.SERVICE_RATE, serviceRate);
  }, [serviceRate]);

  useEffect(() => {
    saveToLocalStorage(DD1K_STORAGE_KEYS.INITIAL_CUSTOMERS, initialCustomers);
  }, [initialCustomers]);

  // Determine if Initial Customers are Required
  useEffect(() => {
    if (arrivalRate === "" || serviceRate === "") {
      setIsInitialCustomersRequired(false);
    } else {
      try {
        const evaluatedArrivalRate = evaluate(arrivalRate + "");
        const evaluatedServiceRate = evaluate(serviceRate + "");
        setIsInitialCustomersRequired(
          evaluatedArrivalRate <= evaluatedServiceRate
        );
      } catch {
        setIsInitialCustomersRequired(false);
      }
    }
  }, [arrivalRate, serviceRate]);

  const contextValue = useMemo(() => {
    return {
      capacity,
      setCapacity,
      buffer,
      setBuffer,
      arrivalRate,
      setArrivalRate,
      serviceRate,
      setServiceRate,
      initialCustomers,
      setInitialCustomers,
      arrivalTime,
      setArrivalTime,
      serviceTime,
      setServiceTime,
      isInitialCustomersRequired,
    };
  }, [
    capacity,
    setCapacity,
    buffer,
    setBuffer,
    arrivalRate,
    setArrivalRate,
    serviceRate,
    setServiceRate,
    initialCustomers,
    setInitialCustomers,
    arrivalTime,
    setArrivalTime,
    serviceTime,
    setServiceTime,
    isInitialCustomersRequired,
  ]);

  return (
    <DD1KContext.Provider value={contextValue}>{children}</DD1KContext.Provider>
  );
};

export const useDD1K = () => {
  const context = useContext(DD1KContext);
  if (context === undefined) {
    throw new Error("useDD1K must be used within a DD1KProvider");
  }
  return context;
};
