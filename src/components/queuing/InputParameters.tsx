import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import InfinityLinkIndicator from "../InfinityLinkIndicator";
import { Box } from "@mui/material";

export default function InputParameters({
  setArrivalRate,
  setServiceRate,
  arrivalRate,
  serviceRate,
  setArrivalTime,
  setServiceTime,
  arrivalTime,
  serviceTime,
}) {
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
            <InfinityLinkIndicator />
          </Box>
        </Grid>
        {/* Service Rate-Time Input Fields */}
        <Grid size={{ xs: 11 }}>
          <Grid container spacing={2}>
            {/* Service Rate */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Service Rate (μ)"
                value={serviceRate}
                onChange={(e) => {
                  setServiceRate(e.target.value);
                  if (e.target.value) {
                    setServiceTime(1 / parseFloat(e.target.value));
                  }
                }}
                placeholder="Enter service rate"
                fullWidth
              />
            </Grid>

            {/* Service Time */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Service Time (1/μ)"
                value={serviceTime}
                onChange={(e) => {
                  setServiceTime(e.target.value);
                  if (e.target.value) {
                    setServiceRate(1 / parseFloat(e.target.value));
                  }
                }}
                placeholder="Enter service time"
                fullWidth
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
            <InfinityLinkIndicator />
          </Box>
        </Grid>

        {/* Arrival Rate-Time Input Fields */}
        <Grid size={{ xs: 11 }}>
          <Grid container spacing={2}>
            {/* Arrival Rate */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Arrival Rate (λ)"
                value={arrivalRate}
                onChange={(e) => {
                  setArrivalRate(e.target.value);
                  if (e.target.value) {
                    setArrivalTime(1 / parseFloat(e.target.value));
                  }
                }}
                placeholder="Enter arrival rate"
                fullWidth
              />
            </Grid>

            {/* Arrival Time */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Arrival Time (1/λ)"
                value={arrivalTime}
                onChange={(e) => {
                  setArrivalTime(e.target.value);
                  if (e.target.value) {
                    setArrivalRate(1 / parseFloat(e.target.value));
                  }
                }}
                placeholder="Enter arrival time"
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
