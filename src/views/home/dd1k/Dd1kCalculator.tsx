"use client";

import React, { JSX, useState } from "react";
import { evaluate } from "mathjs";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import InputParameters from "@/components/input/InputParameters";
import DD1KResults from "@/components/output/DD1K/DD1KResults";
import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import dd1kFactoryMethod from "@/class/dd1k/dd1kFactoryMethod";
import Dd1kSystemParameters from "./Dd1kSystemParameters";
import { NoNumberArrowsTextField } from "@/components/base/NoNumberArrowsTextField";
import { isValidPositiveInteger, isValidPositiveNumber } from "@/lib/math";
import { useDD1K } from "@/contexts/DD1KContext";

const Dd1kCalculator: React.FC = () => {
  const {
    capacity,
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
    isInitialCustomersRequired
  } = useDD1K();

  const [error, setError] = useState("");
  const [results, setResults] = useState<JSX.Element | null>(null);

  const handleCalculate = () => {
    let evaluatedCapacity;
    try {
      evaluatedCapacity = evaluate(capacity + "");
      if (!isValidPositiveNumber(evaluatedCapacity)) {
        setError("'K' must be +Integer");
        return;
      }
    } catch {
      setError(" 'K' must be +Integer");
      return;
    }

    let evaluatedServiceRate;
    try {
      evaluatedServiceRate = evaluate(serviceRate + "");
      if (!isValidPositiveNumber(evaluatedServiceRate)) {
        setError("'μ': must be +Number");
        return;
      }
    } catch {
      setError("'μ': must be +Number");
      return;
    }

    let evaluatedArrivalRate;
    try {
      evaluatedArrivalRate = evaluate(arrivalRate + "");
      if (!isValidPositiveNumber(evaluatedArrivalRate)) {
        setError("'λ': must be +Number");
        return;
      }
    } catch {
      setError("'λ': must be +Number");
      return;
    }

    let evaluateInitialCustomers;

    if (isInitialCustomersRequired) {
      try {
        evaluateInitialCustomers = evaluate(initialCustomers + "");
        if (!isValidPositiveInteger(evaluateInitialCustomers)) {
          setError("M: must be +Integer");
          return;
        }
      } catch (e) {
        setError("'M': must be +Integer");
        console.error(e.message);
        return;
      }
    }

    // Clear previous errors and results
    setError("");
    setResults(null);

    const M = isInitialCustomersRequired ? evaluateInitialCustomers : undefined;
    try {
      const dd1k = dd1kFactoryMethod(
        evaluatedArrivalRate,
        evaluatedServiceRate,
        evaluatedCapacity,
        M
      );
      setResults(<DD1KResults dd1k={dd1k} />);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Container
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Dd1kSystemParameters />
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
        {isInitialCustomersRequired && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }} container>
              <Grid size={1} />
              <Grid size={11}>
                <NoNumberArrowsTextField
                  value={initialCustomers}
                  placeholder={"Initial Customers: M"}
                  label="Initial Customers: M"
                  fullWidth
                  required={isInitialCustomersRequired}
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
          <Grid size={{ xs: 1, sm: 0.5 }} />
          <Grid size={{ xs: 11, sm: 11.5 }} justifyContent={"start"}>
            <Button
              variant="outlined"
              sx={{
                fontWeight: "700",
              }}
              onClick={handleCalculate}
              fullWidth
            >
              Analyze
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box mt={4}>
        {error && (
          <Alert
            variant="standard"
            severity="error"
            sx={{
              mb: 4,
              fontWeight: "600",
              letterSpacing: "2",
              fontFamily: "sans-serif",
            }}
          >
            {error}
          </Alert>
        )}

        {results}
      </Box>
    </Container>
  );
};

export default Dd1kCalculator;