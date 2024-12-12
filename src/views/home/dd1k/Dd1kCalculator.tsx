"use client";

import React, {JSX, useEffect, useState } from "react";
import { evaluate } from "mathjs"; // Import evaluate from mathjs
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
import { isValidPositiveValue } from "@/lib/math";

const  Dd1kCalculator: React.FC = () => {
  // dd1k
  const [capacity, setCapacity] = useState<number | undefined>(
    () => localStorage.getItem("capacity") as unknown as number
  );
  const [arrivalRate, setArrivalRate] = useState(() => {
    const saved = localStorage.getItem("arrivalRate");
    return saved ?? "";
  });
  const [serviceRate, setServiceRate] = useState(() => {
    const saved = localStorage.getItem("serviceRate");
    return saved ?? "";
  });
  const [arrivalTime, setArrivalTime] = useState(() => {
    const saved = localStorage.getItem("arrivalTime");
    return saved ?? "";
  });
  const [serviceTime, setServiceTime] = useState(() => {
    const saved = localStorage.getItem("serviceTime");
    return saved ?? "";
  });

  // mmxy
  const [error, setError] = useState("");
  const [results, setResults] = useState<JSX.Element | null>(null);

  const [isInitialCutsomersRequired, setIsInitialCutsomersRequired] =
    useState(false);

  const [initialCustomers, setInitialCustomers] = useState<number | undefined>(
    () => localStorage.getItem("initialCustomers") as unknown as number
  );

  useEffect(() => {
    if (arrivalRate === "" || serviceRate === "") {
      setIsInitialCutsomersRequired(false);
      setInitialCustomers(undefined);
    } else {
      try {
        const evaluatedArrivalRate = evaluate(arrivalRate);
        const evaluatedServiceRate = evaluate(serviceRate);
        if (evaluatedArrivalRate <= evaluatedServiceRate) {
          setIsInitialCutsomersRequired(true);
        } else {
          setIsInitialCutsomersRequired(false);
          setInitialCustomers(undefined);
        }
      } catch {
        setIsInitialCutsomersRequired(false);
        setInitialCustomers(undefined);
      }
    }
  }, [arrivalRate, serviceRate]);

  useEffect(() => {
    localStorage.setItem("capacity", JSON.stringify(capacity));
  }, [capacity]);

  useEffect(() => {
    localStorage.setItem("arrivalRate", arrivalRate);
  }, [arrivalRate]);

  useEffect(() => {
    localStorage.setItem("serviceRate", serviceRate);
  }, [serviceRate]);

  useEffect(() => {
    localStorage.setItem("arrivalTime", arrivalTime);
  }, [arrivalTime]);

  useEffect(() => {
    localStorage.setItem("serviceTime", serviceTime);
  }, [serviceTime]);

  useEffect(() => {
    localStorage.setItem("initialCustomers", JSON.stringify(initialCustomers));
  }, [initialCustomers]);

  const handleInitialCustomersChange = (value: string) => {
    try {
      if (value === "") {
        setInitialCustomers(undefined);
        return;
      }
      const evaluatedValue = evaluate(value);
      if (
        isValidPositiveValue(evaluatedValue) &&
        Number.isInteger(evaluatedValue)
      ) {
        setInitialCustomers(evaluatedValue);
      }
    } catch {
      return; // Do not update state if evaluation fails
    }
  };

  const handleCalculate = () => {
    const evaluatedArrivalRate = evaluate(arrivalRate);
    const evaluatedServiceRate = evaluate(serviceRate);
    // Clear previous errors and results
    setError("");
    setResults(null);

    // Basic input validation
    if (!arrivalRate || !serviceRate) {
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

    if (capacity !== undefined && capacity <= 0) {
      setError("Capacity must be a positive value.");
      return;
    }

    if (initialCustomers !== undefined && initialCustomers <= 0) {
      setError("Initial customers must be a positive value.");
      return;
    }

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
                      value={isNaN(initialCustomers) ? "" : initialCustomers}
                      placeholder={"Initial Customers: M"}
                      label="Initial Customers: M"
                      fullWidth
                      required={isInitialCutsomersRequired}
                      autoComplete={"dd1k-initial-customers"}
                      onChange={(e) => {
                        handleInitialCustomersChange(e.target.value);
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
}


export default Dd1kCalculator;