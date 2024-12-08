"use client";

import { JSX, useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { mm1, mm1k, mmc, mmck, dd1, dd1k } from "@/lib";
import SystemParameters from "@/components/queuing/SystemParameters";
import InputParameters from "@/components/queuing/InputParameters";
import MM1Results from "@/components/results/MM1Results";
import MM1KResults from "@/components/results/MM1KResults";
import MMCResults from "@/components/results/MMCResults";
import MMCKResults from "@/components/results/MMCKResults";
import DD1Results from "@/components/results/DD1Results";
import DD1KResults from "@/components/results/DD1KResults";
import ProcessTypeSelector from "@/components/queuing/ProcessTypeSelector";
import { MathJaxContext } from "better-react-mathjax";
import { DD1KCharacteristics } from "@/types/dd1k";
import { InfoIcon } from "lucide-react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { Process } from "@/types/queue";
import Grid from "@mui/material/Grid2";

export default function QueuingTheoryCalculator() {
  const [queueType, setQueueType] = useState<Process>("D/D");
  const [servers, setServers] = useState<number | undefined>(1);
  const [capacity, setCapacity] = useState<number | undefined>();
  const [arrivalRate, setArrivalRate] = useState("");
  const [serviceRate, setServiceRate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<JSX.Element | null>(null);

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
        characteristics = dd1k(
          parseFloat(arrivalRate),
          parseFloat(serviceRate),
          capacity
        );
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
    <div className="container mx-auto p-4 text-sm sm:text-base">
      <Card>
        <CardHeader>
          <Typography variant="h5">Queuing Theory Calculator</Typography>
          <Typography variant="body2">
            Calculate key performance metrics for various queuing systems
          </Typography>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
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
            <Grid size={12} container spacing={0} alignItems="start">
              {/* Empty Column */}
              <Grid size={1} />
              <Grid size={11} container justifyContent='center'>
                <Button
                  variant="contained"
                  onClick={handleCalculate}
                  sx={{ width: "80%" }}
                >
                  Calculate
                </Button>
              </Grid>
            </Grid>
          </div>

          <div className="mt-8">
            {error && (
              <Alert severity="error" className="mb-6">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
