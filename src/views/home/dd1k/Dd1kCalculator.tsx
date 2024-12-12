"use client";

import React, { JSX, useEffect, useState } from "react";
import { evaluate, format, fraction } from "mathjs"; // Import evaluate from mathjs
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import InputParameters from "@/components/input/InputParameters";
import DD1KResults from "@/components/output/DD1K/DD1KResults";
import { Card, CardHeader, CardContent, Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import dd1kFactoryMethod from "@/class/dd1k/dd1kFactoryMethod";
import Dd1kSystemParameters from "./Dd1kSystemParameters";
import { NoNumberArrowsTextField } from "@/components/base/NoNumberArrowsTextField";
import { isValidPositiveInteger, isValidPositiveNumber } from "@/lib/math";

export const dd1kCapacityKey = "dd1k-capacity";
const serviceRateKey = "dd1k-serviceRate";
const arrivalRateKey = "dd1k-arrivalRate";
const initialCustomersKey = "dd1k-initialCustomers";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFromLocalStorage = (
  key: string,
  defaultValue: any = "",
  parse?: boolean
) => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    if (saved) {
      return parse ? parseInt(saved) : saved;
    }
    return defaultValue;
  }
  return defaultValue;
};

const Dd1kCalculator: React.FC = () => {
  // dd1k
  const [capacity, setCapacity] = useState<string>("");
  const [arrivalRate, setArrivalRate] = useState<string>("");
  const [arrivalTime, setArrivalTime] = useState("");

  const [serviceRate, setServiceRate] = useState<string>("");
  const [serviceTime, setServiceTime] = useState("");

  const [initialCustomers, setInitialCustomers] = useState<string>("");

  useEffect(() => {
    setCapacity(getFromLocalStorage(dd1kCapacityKey, null, true));

    const serviceRate = getFromLocalStorage(serviceRateKey, "");
    const evaluatedServiceRate = evaluate(serviceRate);
    if (isValidPositiveNumber(evaluatedServiceRate)) {
      const c = setServiceRate(
        Number.isInteger(evaluatedServiceRate)
          ? evaluatedServiceRate
          : format(fraction(evaluatedServiceRate), { fraction: "ratio" })
      );
      const serviceTime = 1 / evaluatedServiceRate;
      setServiceTime(
        Number.isInteger(serviceTime)
          ? serviceTime.toString()
          : format(fraction(serviceTime), { fraction: "ratio" })
      );
    }

    const arrivalRate = getFromLocalStorage(arrivalRateKey, "");
    const evaluatedArrivalRate = evaluate(arrivalRate);
    if (isValidPositiveNumber(evaluatedArrivalRate)) {
      setArrivalRate(
        Number.isInteger(evaluatedArrivalRate)
          ? evaluatedArrivalRate
          : format(fraction(evaluatedArrivalRate), { fraction: "ratio" })
      );
      const arrivalTime = 1 / evaluatedArrivalRate;
      setArrivalTime(
        Number.isInteger(arrivalTime)
          ? arrivalTime.toString()
          : format(fraction(arrivalTime), { fraction: "ratio" })
      );
    }

    if (evaluatedArrivalRate <= evaluatedServiceRate) {
      setIsInitialCutsomersRequired(true);
    } else {
      setIsInitialCutsomersRequired(false);
    }

    setInitialCustomers(
      getFromLocalStorage("dd1k-initialCustomers", null, true)
    );
  }, [localStorage]);

  const [isInitialCutsomersRequired, setIsInitialCutsomersRequired] =
    useState(false);

  // mmxy
  const [error, setError] = useState("");
  const [results, setResults] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (arrivalRate === "" || serviceRate === "") {
      setIsInitialCutsomersRequired(false);
    } else {
      try {
        const evaluatedArrivalRate = evaluate(arrivalRate);
        const evaluatedServiceRate = evaluate(serviceRate);
        if (evaluatedArrivalRate <= evaluatedServiceRate) {
          setIsInitialCutsomersRequired(true);
        } else {
          setIsInitialCutsomersRequired(false);
        }
      } catch {
        setIsInitialCutsomersRequired(false);
      }
    }
  }, [arrivalRate, serviceRate]);

  useEffect(() => {
    localStorage.setItem(dd1kCapacityKey, capacity?.toString());
  }, [capacity]);

  useEffect(() => {
    localStorage.setItem(arrivalRateKey, arrivalRate);
  }, [arrivalRate]);

  useEffect(() => {
    localStorage.setItem(serviceRateKey, serviceRate);
  }, [serviceRate]);

  useEffect(() => {
    localStorage.setItem(initialCustomersKey, initialCustomers?.toString());
  }, [initialCustomers]);

  const handleCalculate = () => {
    if (isNaN(capacity) || !isValidPositiveNumber(capacity)) {
      setError("Please enter a positive Capacity.");
      return;
    }

    const evaluatedArrivalRate = evaluate(arrivalRate);

    if (!isValidPositiveNumber(evaluatedArrivalRate)) {
      setError("Please enter a positive Arrival Rate.");
      return;
    }

    const evaluatedServiceRate = evaluate(serviceRate);
    if (!isValidPositiveNumber(evaluatedServiceRate)) {
      setError("Please enter a positive Service Rate.");
      return;
    }

    if (isInitialCutsomersRequired) {
      if (!isValidPositiveInteger(initialCustomers)) {
        setError("Please enter a positive Initial Customers Value.");
        return;
      }
    }
    if (!arrivalRate || !serviceRate) {
      // Basic input validation
      setError("Please enter both arrival rate and service rate.");
      return;
    }

    if (evaluatedArrivalRate <= 0 || evaluatedServiceRate <= 0) {
      setError("Arrival rate and service rate must be positive values.");
      return;
    }

    if (isNaN(capacity) && evaluatedArrivalRate > evaluatedServiceRate) {
      setError(
        "System is unstable without finite capacity. Please enter a finite capacity."
      );
      return;
    }

    if (initialCustomers !== undefined && initialCustomers <= 0) {
      setError("Initial customers must be a positive value.");
      return;
    }

    // Clear previous errors and results
    setError("");
    setResults(null);

    try {
      if (capacity !== null) {
        if (
          evaluatedArrivalRate === evaluatedServiceRate ||
          evaluatedArrivalRate < evaluatedServiceRate
        ) {
          setIsInitialCutsomersRequired(true);
          if (!initialCustomers) {
            setError("Please enter initial customers.");
            return;
          }
        }
        const dd1k = dd1kFactoryMethod(
          evaluatedArrivalRate,
          evaluatedServiceRate,
          capacity,
          initialCustomers
        );
        setResults(<DD1KResults dd1k={dd1k} />);
      } else {
        setError("Unsupported queue configuration.");
        return;
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Container
      // maxWidth="lg"
      sx={(theme) => ({
        py: 4,
        maxWidth: "100%",
        [theme.breakpoints.up("xs")]: {
          maxWidth: "100%",
        },
        [theme.breakpoints.up("sm")]: {
          maxWidth: theme.breakpoints.values.lg,
        },
        [theme.breakpoints.up("md")]: {
          maxWidth: theme.breakpoints.values.md,
        },
        marginLeft: "auto",
        marginRight: "auto",
        t: 0,
        p: 0,
        borderRadius: 0,
      })}
    >
      <Card
        sx={{
          mt: 0,
          p: 0,
          borderRadius: 0,
          height: "100%",
          minHeight: "100vh",
          boxShadow: "none",
        }}
      >
        <CardHeader></CardHeader>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Dd1kSystemParameters
              setCapacity={setCapacity}
              capacity={capacity}
            />
            <InputParameters
              setArrivalRate={setArrivalRate}
              setServiceRate={setServiceRate}
              arrivalRate={arrivalRate}
              serviceRate={serviceRate}
              setArrivalTime={setArrivalTime}
              setServiceTime={setServiceTime}
              arrivalTime={arrivalTime}
              serviceTime={serviceTime}
            />
            {isInitialCutsomersRequired && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }} container>
                  {/* Empty Column */}
                  <Grid size={1} />
                  <Grid size={11}>
                    <NoNumberArrowsTextField
                      value={initialCustomers}
                      placeholder={"Initial Customers: M"}
                      label="Initial Customers: M"
                      fullWidth
                      type="number"
                      required={isInitialCutsomersRequired}
                      autoComplete={"dd1k-initial-customers"}
                      onChange={(e) => {
                        setInitialCustomers(e.target.value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid size={12} container spacing={0} alignItems="start">
              {/* Empty Column */}
              <Grid size={1} />
              <Grid size={11} justifyContent={"start"}>
                <Button variant="contained" onClick={handleCalculate} fullWidth>
                  Process
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box mt={4}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}

            {results}

            {!results && (
              <Alert
                severity="info"
                className="mt-6"
                sx={{
                  backgroundColor: "background.paper",
                }}
              >
                <AlertTitle>Note</AlertTitle>
                <span className="ml-2 mt-1">
                  For D/D/1 and D/D/1/(k-1) models, the Time (t) field is used
                  for transient analysis. For unstable systems (λ {">"} μ),
                  results may be limited or require additional explanation.
                </span>
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dd1kCalculator;
