"use client";

import { JSX, useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { mm } from "@/lib/mm";
import InputParameters from "@/components/input/InputParameters";
import MMResults from "@/components/output/MMResults";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Container,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { MMCharacteristics } from "@/types/mm";
import MmSystemParameters from "./MmSystemParameters";

export default function QueuingTheoryCalculator() {

    const [servers, setServers] = useState<number | undefined>(undefined);
  const [capacity, setCapacity] = useState<number | undefined>(undefined);
  const [arrivalRate, setArrivalRate] = useState("");
  const [serviceRate, setServiceRate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [serviceTime, setServiceTime] = useState("");

  // mmxy
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

    try {
      const  characteristics: MMCharacteristics = mm(
          parseFloat(arrivalRate),
          parseFloat(serviceRate),
          capacity,
          servers
        );
        if (characteristics.validSystem) {
          setResults(<MMResults characteristics={characteristics} />);
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
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
