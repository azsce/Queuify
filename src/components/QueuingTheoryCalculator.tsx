"use client";

import { JSX, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
// import { mm1, mm1k, mmc, mmck, dd1 } from "@/lib";
import DD1K from "@/lib/dd1k";
import SystemParameters from "@/components/queuing/SystemParameters";
import InputParameters from "@/components/queuing/InputParameters";
// import MM1Results from "@/components/results/MM1Results";
// import MM1KResults from "@/components/results/MM1KResults";
// import MMCResults from "@/components/results/MMCResults";
// import MMCKResults from "@/components/results/MMCKResults";
// import DD1Results from "@/components/results/DD1Results";
import DD1KResults from "@/components/results/DD1K/DD1KResults";
import ProcessTypeSelector from "@/components/queuing/ProcessTypeSelector";
// import { MathJaxContext } from "better-react-mathjax";
import { DD1KCharacteristics } from "@/types/dd1k";
// import { InfoIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { Process } from "@/types/queue";
import Grid from "@mui/material/Grid2";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { NoNumberArrowsTextField } from "./NoNumberArrowsTextField";

export default function QueuingTheoryCalculator() {
  const [queueType, setQueueType] = useState<Process>("D/D");
  const [servers, setServers] = useState<number | undefined>(1);
  const [capacity, setCapacity] = useState<number | undefined>(5);
  const [arrivalRate, setArrivalRate] = useState("0.25");
  const [serviceRate, setServiceRate] = useState("0.125");
  const [arrivalTime, setArrivalTime] = useState("4");
  const [serviceTime, setServiceTime] = useState("8");
  const [error, setError] = useState("");
  const [results, setResults] = useState<JSX.Element | null>(null);

  const [isInitialCutsomersRequired, setIsInitialCutsomersRequired] =
    useState(false);
  const [initialCustomers, setInitialCustomers] = useState<
    number | undefined
  >();

  useEffect(() => {
    if (queueType === "D/D") {
      if (arrivalRate === serviceRate || arrivalRate < serviceRate) {
        setIsInitialCutsomersRequired(true);
      } else {
        setIsInitialCutsomersRequired(false);
      }
    } else {
      setIsInitialCutsomersRequired(false);
    }
  }, [queueType, arrivalRate, serviceRate]);

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
    if (queueType === "D/D" && servers !== 1) {
      setError(
        "Current implementation only handles D/D/1 and D/D/1/(k-1) – single server deterministic queues."
      );
      return;
    }

    if (
      queueType === "D/D" &&
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
      let characteristics: DD1KCharacteristics;
      // if (
      //   queueType === "M/M" &&
      //   servers === "1" &&
      //   capacity === "∞"
      // ) {
      //   results = mm1(parseFloat(arrivalRate), parseFloat(serviceRate));
      //   setResults(<MM1Results results={results} />);
      // } else if (
      //   queueType === "M/M" &&
      //   servers === "1" &&
      //   capacity !== "∞"
      // ) {
      //   results = mm1k(
      //     parseFloat(arrivalRate),
      //     parseFloat(serviceRate),
      //     parseInt(capacity)
      //   );
      //   setResults(<MM1KResults results={results} />);
      // } else if (
      //   queueType === "M/M" &&
      //   servers !== "1" &&
      //   capacity === "∞"
      // ) {
      //   results = mmc(
      //     parseFloat(arrivalRate),
      //     parseFloat(serviceRate),
      //     parseInt(servers)
      //   );
      //   setResults(<MMCResults results={results} />);
      // } else if (
      //   queueType === "M/M" &&
      //   servers !== "1" &&
      //   capacity !== "∞"
      // ) {
      //   results = mmck(
      //     parseFloat(arrivalRate),
      //     parseFloat(serviceRate),
      //     parseInt(servers),
      //     parseInt(capacity)
      //   );
      //   setResults(<MMCKResults results={results} />);
      // } else if (
      //   queueType === "D/D" &&
      //   servers === "1" &&
      //   capacity === "∞"
      // ) {
      //   results = dd1(parseFloat(arrivalRate), parseFloat(serviceRate));
      //   setResults(<DD1Results results={results} />);
      // } else
      if (queueType === "D/D" && servers === 1 && capacity !== null) {
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
        setResults(<DD1KResults characteristics={characteristics} />);
      } else {
        setError("Unsupported queue configuration.");
        return;
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div">
            Queuing Theory Calculator
          </Typography>
        </Toolbar>
      </AppBar>
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
        })}
      >
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <ProcessTypeSelector setProcessType={setQueueType} />
              <SystemParameters
                setServers={setServers}
                setCapacity={setCapacity}
                servers={servers}
                capacity={capacity}
                processType={queueType}
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
                  <Button
                    variant="contained"
                    onClick={handleCalculate}
                    fullWidth
                  >
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

              {/* <Alert severity="info" className="mt-6">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <span className="ml-2 mt-1">
                  For D/D/1 and D/D/1/(k-1) models, the Time (t) field is used for
                  transient analysis. For unstable systems (λ {">"} μ), results
                  may be limited or require additional explanation.
                </span>
              </Alert> */}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
