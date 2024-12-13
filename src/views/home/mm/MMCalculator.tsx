"use client";

import { JSX, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { mm } from "@/lib/mm";
import InputParameters from "@/components/input/InputParameters";
import MMResults from "@/components/output/MMResults";
import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { MMCharacteristics } from "@/types/mm";
import MmSystemParameters from "./MmSystemParameters";
import { getFromLocalStorage } from "@/utils/localstorage";
import { evaluate, format, fraction } from "mathjs";
import { isValidPositiveInteger, isValidPositiveNumber } from "@/lib/math";

let init = true;

const serversKey = "mm-servers";
const mmCapacityKey = "mm-capacity";
const serviceRateKey = "mm-serviceRate";
const arrivalRateKey = "mm-arrivalRate";
const simulationsKey = "mm-simulations";

export default function QueuingTheoryCalculator() {
  const [servers, setServers] = useState("");
  const [capacity, setCapacity] = useState("");
  const [arrivalRate, setArrivalRate] = useState("");
  const [serviceRate, setServiceRate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [simulations, setSimulations] = useState("");

  useEffect(() => {
    if (init) {
      init = false;

      const savedServers = getFromLocalStorage(serversKey, "");
      const evaluatedServers = evaluate(savedServers + "");
      if (isValidPositiveInteger(evaluatedServers)) {
        setServers(evaluatedServers);
      }

      const savedCapacity = getFromLocalStorage(mmCapacityKey, "");
      const evaluatedCapacity = evaluate(savedCapacity);
      if (isValidPositiveInteger(evaluatedCapacity)) {
        setCapacity(evaluatedCapacity);
      }

      const savedServiceRate = getFromLocalStorage(serviceRateKey, "");
      const evaluatedServiceRate = evaluate(savedServiceRate + "");
      if (isValidPositiveNumber(evaluatedServiceRate)) {
        setServiceRate(
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
      const evaluatedArrivalRate = evaluate(arrivalRate + "");
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

        const savedSimulations = getFromLocalStorage(simulationsKey, "");
        const evaluatedSimulations = evaluate(savedSimulations);
        if (isValidPositiveInteger(evaluatedSimulations)) {
          setSimulations(evaluatedSimulations);
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(serversKey, servers);
  }, [servers]);

  useEffect(() => {
    localStorage.setItem(mmCapacityKey, capacity);
  }, [capacity]);

  useEffect(() => {
    localStorage.setItem(arrivalRateKey, arrivalRate);
  }, [arrivalRate]);

  useEffect(() => {
    localStorage.setItem(serviceRateKey, serviceRate);
  }, [serviceRate]);

  useEffect(() => {
    localStorage.setItem(simulationsKey, simulations);
  }, [simulations]);

  // mmxy
  const [error, setError] = useState("");
  const [results, setResults] = useState<JSX.Element | null>(null);

  const handleCalculate = () => {
    let evaluatedServers;
      try {
        evaluatedServers = evaluate(servers + "");
        if (!isValidPositiveInteger(evaluatedServers)) {
          setError("'S' must be +Integer");
          return;
        }
      } catch {
        setError("'S'must be +Integer");
        return;
      }

    let evaluatedCapacity;
    if (capacity) {
      try {
        evaluatedCapacity = evaluate(capacity + "");
        if (!isValidPositiveNumber(evaluatedCapacity)) {
          setError("'K' not valid");
          return;
        }
      } catch {
        setError(" 'K' not valid");
        return;
      }
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

    let evaluatedSimulations;
    if (evaluatedSimulations) {
      try {
        evaluatedSimulations = evaluate(simulations + "");
        if (!isValidPositiveInteger(evaluatedSimulations)) {
          setError("'N': not valid");
          return;
        }
      } catch {
        setError("'N': not valid");
        return;
      }
    }

    // Clear previous errors and results
    setError("");
    setResults(null);

    // Basic input validation
    if (!arrivalRate || !serviceRate) {
      setError("Please enter both arrival rate and service rate.");
      return;
    }

    try {
      const characteristics: MMCharacteristics = mm(
        evaluatedServiceRate,
        evaluatedArrivalRate,
        evaluatedServers,
        evaluatedCapacity
      );
      setResults(<MMResults characteristics={characteristics} />);
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
          maxWidth: "95%",
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
        <MmSystemParameters
          setServers={setServers}
          setCapacity={setCapacity}
          servers={servers}
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
        <Grid size={12} container spacing={0} alignItems="start">
          {/* Empty Column */}
          <Grid size={1} />
          <Grid size={11} justifyContent={"start"}>
            <Button variant="contained" onClick={handleCalculate} fullWidth>
              Analyze
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
      </Box>
    </Container>
  );
}
