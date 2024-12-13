import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import VerticalInfinityLinkIndicator from "../base/VerticalInfinityLinkIndicator";
import { Box } from "@mui/material";
import { evaluate, fraction, format } from "mathjs"; // Import mathjs
import { isValidPositiveNumber } from "@/lib/math";

type InputParametersProps = {
  setArrivalRate: (value: string) => void;
  setServiceRate: (value: string) => void;
  arrivalRate: string;
  serviceRate: string;
  setArrivalTime: (value: string) => void;
  setServiceTime: (value: string) => void;
  arrivalTime: string;
  serviceTime: string;
  initialCutsomers?: number;
  setInitialCustomers?: (value: number) => void;
};

const InputParameters: React.FC<InputParametersProps> = ({
  setArrivalRate,
  setServiceRate,
  arrivalRate,
  serviceRate,
  setArrivalTime,
  setServiceTime,
  arrivalTime,
  serviceTime,
}) => {
  const handleServiceRateChange = (value: string) => {
    if (value === "") {
      setServiceRate("");
      setServiceTime("");
      return;
    }
    try {
      setServiceRate(value);
      const evaluatedValue = evaluate(value);
      console.log(evaluatedValue);
      if (isValidPositiveNumber(evaluatedValue)) {
        const serviceTime = 1 / evaluatedValue;
        if (Number.isInteger(serviceTime)) {
          setServiceTime(serviceTime.toString());
        } else {
          setServiceTime(format(fraction(serviceTime), { fraction: "ratio" }));
        }
      }
    } catch {
      return; // Do not update state if evaluation fails
    }
  };

  const handleServiceTimeChange = (value: string) => {
    if (value === "") {
      setServiceTime("");
      setServiceRate("");
      return;
    }
    try {
      setServiceTime(value);
      const evaluatedValue = evaluate(value);
      if (isValidPositiveNumber(evaluatedValue)) {
        const serviceRate = 1 / evaluatedValue;
        if (Number.isInteger(serviceRate)) {
          setServiceRate(serviceRate.toString());
        } else {
          setServiceRate(format(fraction(serviceRate), { fraction: "ratio" }));
        }
      }
    } catch {
      return; // Do not update state if evaluation fails
    }
  };

  const handleArrivalRateChange = (value: string) => {
    if (value === "") {
      setArrivalRate("");
      setArrivalTime("");
      return;
    }
    try {
      setArrivalRate(value);
      const evaluatedValue = evaluate(value);
      if (isValidPositiveNumber(evaluatedValue)) {
        const arrivalTime = 1 / evaluatedValue;
        if (Number.isInteger(arrivalTime)) {
          setArrivalTime(arrivalTime.toString());
        } else {
          setArrivalTime(format(fraction(arrivalTime), { fraction: "ratio" }));
        }
      }
    } catch {
      return; // Do not update state if evaluation fails
    }
  };

  const handleArrivalTimeChange = (value: string) => {
    if (value === "") {
      setArrivalTime("");
      setArrivalRate("");
      return;
    }
    try {
      setArrivalTime(value);
      const evaluatedValue = evaluate(value);

      if (isValidPositiveNumber(evaluatedValue)) {
        const arrivalRate = 1 / evaluatedValue;
        if (Number.isInteger(arrivalRate)) {
          setArrivalRate(arrivalRate.toString());
        } else {
          setArrivalRate(format(fraction(arrivalRate), { fraction: "ratio" }));
        }
      }
    } catch {
      return; // Do not update state if evaluation fails
    }
  };

  return (
    <Grid container spacing={2}>
      {/* Service Rate-Time */}
      <Grid size={{ xs: 12, sm: 6 }} container spacing={0} alignItems="center">
        {/* Service Rate-Time Infinity Link Indicator */}
        <Grid
          size={{ xs: 1 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <VerticalInfinityLinkIndicator />
          </Box>
        </Grid>
        {/* Service Rate-Time Input Fields */}
        <Grid size={{ xs: 11 }}>
          <Grid container spacing={2}>
            {/* Service Rate */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Service Rate (μ)"
                value={serviceRate ?? ""}
                onChange={(e) => handleServiceRateChange(e.target.value)}
                placeholder="μ"
                fullWidth
                required={true}
              />
            </Grid>

            {/* Service Time */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Service Time (1/μ)"
                value={serviceTime ?? ""}
                onChange={(e) => handleServiceTimeChange(e.target.value)}
                placeholder="1/μ"
                fullWidth
                required={true}
              />
            </Grid>
          </Grid>
        </Grid>{" "}
        {/* Service Rate-Time Input Fields */}
      </Grid>
      {/* Service Rate-Time And Infinity Link Indicator  */}

      {/* Arrival Rate-Time And Infinity Link Indicator */}
      <Grid size={{ xs: 12, sm: 6 }} container spacing={0} alignItems="center">
        {/* Arrival Rate-Time Infinity Link Indicator */}
        <Grid
          size={{ xs: 1 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <VerticalInfinityLinkIndicator />
          </Box>
        </Grid>

        {/* Arrival Rate-Time Input Fields */}
        <Grid size={{ xs: 11 }}>
          <Grid container spacing={2}>
            {/* Arrival Rate */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Arrival Rate (λ)"
                value={arrivalRate || ""}
                onChange={(e) => handleArrivalRateChange(e.target.value)}
                placeholder="λ"
                fullWidth
                required={true}
              />
            </Grid>

            {/* Arrival Time */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Arrival Time (1/λ)"
                value={arrivalTime || ""}
                onChange={(e) => handleArrivalTimeChange(e.target.value)}
                placeholder="1/λ"
                fullWidth
                required={true}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InputParameters;
