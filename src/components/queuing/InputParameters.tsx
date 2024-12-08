import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";

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
      <Grid size={{ xs: 12, sm: 6 }}>
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
      <Grid size={{ xs: 12, sm: 6 }}>
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
      <Grid size={{ xs: 12, sm: 6 }}>
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
      <Grid size={{ xs: 12, sm: 6 }}>
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
  );
}
