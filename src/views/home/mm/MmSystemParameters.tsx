import { Dispatch, SetStateAction } from "react";
import Grid from "@mui/material/Grid2";
import InputWithInfinity from "@/components/base/InputWithInfinity";

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
          <InputWithInfinity
            id="mm-servers"
            label="Servers: (C)"
            value={servers}
            onChange={(v) => setServers(v)}
            showInfinity={true}
            onInfinityClick={() => setServers("")}
            autoComplete="mm-servers"
            required={false}
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
