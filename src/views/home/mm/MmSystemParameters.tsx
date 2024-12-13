import { Dispatch, SetStateAction } from "react";
import Grid from "@mui/material/Grid2";
import InputWithInfinity from "@/components/base/InputWithInfinity";
import { NoNumberArrowsTextField } from "@/components/base/NoNumberArrowsTextField";

type SystemParametersProps = {
  setServers: Dispatch<SetStateAction<string>>;
  setCapacity: Dispatch<SetStateAction<string>>;
  servers: string;
  capacity: string;
};

const MmSystemParameters: React.FC<SystemParametersProps> = ({
  setServers,
  setCapacity,
  servers,
  capacity,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }} container spacing={0} alignItems="start">
        {/* Empty Column */}
        <Grid size={1} />
        {/* Number of Servers */}
        <Grid size={11}>
          <NoNumberArrowsTextField
            id="mm-servers"
            label="Servers: (S)"
            value={servers}
            onChange={(e) => setServers(e.target.value)}
            autoComplete="mm-servers"
            required={false}
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }} container spacing={0} alignItems="start">
        {/* Empty Column */}
        <Grid size={1} />
        <Grid size={11}>
          <InputWithInfinity
            id="mm-capacity"
            label="Capacity (K)"
            value={capacity}
            onChange={(v) => setCapacity(v)}
            showInfinity={true}
            onInfinityClick={() => setCapacity("")}
            autoComplete="mm-capacity"
            required={false}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MmSystemParameters;
