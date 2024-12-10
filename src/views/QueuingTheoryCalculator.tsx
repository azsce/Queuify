"use client";

import { JSX, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { mm } from "@/lib/mm";
import DD1K from "@/lib/dd1k";
import SystemParameters from "@/components/queuing/SystemParameters";
import InputParameters from "@/components/queuing/InputParameters";
import MMResults from "@/components/results/MMResults";
import DD1KResults from "@/components/results/DD1K/DD1KResults";
import ProcessTypeSelector from "@/components/queuing/ProcessTypeSelector";
import { DD1KCharacteristics } from "@/types/dd1k";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Container,
  Typography,
} from "@mui/material";
import { Process } from "@/types/queue";
import Grid from "@mui/material/Grid2";
import { NoNumberArrowsTextField } from "../components/NoNumberArrowsTextField";
import { MMCharacteristics } from "@/types/mm";

export default function QueuingTheoryCalculator() {
  const [processType, setQueueType] = useState<Process>("D/D");
  const [servers, setServers] = useState<number | undefined>(1);
  const [capacity, setCapacity] = useState<number | undefined>(5);
  const [arrivalRate, setArrivalRate] = useState("0.25");
  const [serviceRate, setServiceRate] = useState("0.125");
  const [arrivalTime, setArrivalTime] = useState("4");
  const [serviceTime, setServiceTime] = useState("8");
  const [error, setError] = useState("");
  const [dd1kResults, setDd1kResults] = useState<JSX.Element | null>(null);
  const [mmResults, setMmResults] = useState<JSX.Element | null>(null);
  const [results, setResults] = useState<JSX.Element | null>(null);

  const [isInitialCutsomersRequired, setIsInitialCutsomersRequired] =
    useState(false);
  const [initialCustomers, setInitialCustomers] = useState<
    number | undefined
  >();

  useEffect(() => {
    if (processType === "D/D") {
      setResults(dd1kResults);
    } else if (processType === "M/M") {
      setResults(mmResults);
    }
  }, [dd1kResults, mmResults, processType]);

  useEffect(() => {
    if (processType === "D/D") {
      if (arrivalRate === serviceRate || arrivalRate < serviceRate) {
        setIsInitialCutsomersRequired(true);
      } else {
        setIsInitialCutsomersRequired(false);
      }
    } else {
      setIsInitialCutsomersRequired(false);
    }
  }, [processType, arrivalRate, serviceRate]);

  const handleCalculate = () => {
    // Clear previous errors and results
    setError("");
    setResults(null);

    // Basic input validation
    if (!arrivalRate || !serviceRate) {
      setError("Please enter both arrival rate and service rate.");
      return;
    }

    // Check for valid combinations
    if (processType === "D/D" && servers !== 1) {
      setError(
        "Current implementation only handles D/D/1 and D/D/1/(k-1) – single server deterministic queues."
      );
      return;
    }

    if (
      processType === "D/D" &&
      servers === 1 &&
      isNaN(capacity) &&
      parseFloat(arrivalRate) > parseFloat(serviceRate)
    ) {
      setError(
        "System is unstable without finite capacity. Please enter a finite capacity."
      );
      return;
    }

    try {
      let characteristics: DD1KCharacteristics | MMCharacteristics;
      if (processType === "M/M") {
        characteristics = mm(
          parseFloat(arrivalRate),
          parseFloat(serviceRate),
          capacity,
          servers
        );
        if (characteristics.validSystem) {
          setMmResults(<MMResults characteristics={characteristics} />);
        } else {
          setError(
            "The system is unstable. Please check the arrival and service rates."
          );
        }
      } else if (processType === "D/D" && servers === 1 && capacity !== null) {
        if (arrivalRate === serviceRate || arrivalRate < serviceRate) {
          setIsInitialCutsomersRequired(true);
          if (!initialCustomers) {
            setError("Please enter initial customers.");
            return;
          }
        }
        characteristics = DD1K.dd1k(
          parseFloat(arrivalRate),
          parseFloat(serviceRate),
          capacity,
          initialCustomers
        );
        console.log("characteristics", characteristics);
        setDd1kResults(<DD1KResults characteristics={characteristics} />);
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
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.2rem", sm: "1.8rem", md: "2.25rem" },
              textAlign: "center",
              mt: 0,
              mb: 2,
              borderBottom: 1,
              borderColor: "divider",
              pb: 2,
            }}
          >
            Queuing Theory Calculator
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <ProcessTypeSelector setProcessType={setQueueType} />
            <SystemParameters
              setServers={setServers}
              setCapacity={setCapacity}
              servers={servers}
              capacity={capacity}
              processType={processType}
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
                      label="Initial Customers: M"
                      value={initialCustomers}
                      onChange={(e) =>
                        setInitialCustomers(parseInt(e.target.value))
                      }
                      required
                      autoComplete="initial-customers"
                      sx={{ width: "100%" }}
                      error={isInitialCutsomersRequired && !initialCustomers}
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

            {processType === "D/D" && !results && (
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
