"use client";

import { JSX, useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { mm } from "@/lib/mm";
import InputParameters from "@/views/calculator/components/input/InputParameters";
import MMResults from "@/views/calculator/mm/MMResults";
import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { MMCharacteristics } from "@/types/mm";
import MmSystemParameters from "./MmSystemParameters";
import { evaluate } from "mathjs";
import { isValidPositiveInteger, isValidPositiveNumber } from "@/lib/math";
import { useMM } from "@/contexts/MMContext";
import MM1QueueSimulator from "@/class/mm/MM";
import MMGraphContainer from "./MMGraphContainer";

export default function QueuingTheoryCalculator() {
  const {
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
    // setSimulations
  } = useMM();

  // mmxy
  const [error, setError] = useState("");
  const [results, setResults] = useState<JSX.Element | null>(null);
  const [graphContainer, setGraphContainer] = useState<JSX.Element | null>(
    null
  );

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
    if (simulations) {
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
      if (characteristics.validSystem) {
        const simulator = new MM1QueueSimulator(
          evaluatedArrivalRate,
          evaluatedServiceRate,
          evaluatedSimulations
        );

        setResults(<MMResults characteristics={characteristics} />);
        setGraphContainer(<MMGraphContainer queueSystem={simulator} />);
      } else {
        setError(
          "The system is unstable. Please check the arrival and service rates."
        );
      }
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
        <Grid size={12} container spacing={0} alignItems="center">
          {/* Empty Column */}
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

      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {results}
      </Box>
    </Container>
  );
}
