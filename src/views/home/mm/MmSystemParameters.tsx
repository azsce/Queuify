import { Dispatch, SetStateAction } from "react";
import Grid from "@mui/material/Grid2";
import InputWithInfinity from "@/components/base/InputWithInfinity";

type SystemParametersProps = {
  setServers: Dispatch<SetStateAction<number>>;
  setCapacity: Dispatch<SetStateAction<number>>;
  servers: number;
  capacity: number;
};

const MmSystemParameters: React.FC<SystemParametersProps> = ({
  setServers,
  setCapacity,
  servers,
  capacity,
}) => {
  const onCapacityChange = (value: number | undefined) => {
    setCapacity(value);
  };

  const handleServersInfinityClick = () => {
    setServers(undefined);
  };

  const handleCapacityInfinityClick = () => {
    setCapacity(undefined);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }} container spacing={0} alignItems="start">
        {/* Empty Column */}
        <Grid size={1} />
        {/* Number of Servers */}
        <Grid size={11}>
          <InputWithInfinity
            id="servers"
            label="Number of Servers (C)"
            value={servers}
            onChange={(v) => {
              setServers(parseInt(v));
            }}
            showInfinity={true}
            onInfinityClick={handleServersInfinityClick}
            autoComplete="servers"
            required={false}
          />
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }} container spacing={0} alignItems="start">
        {/* Empty Column */}
        <Grid size={1} />
        <Grid size={11}>
          <InputWithInfinity
            id="capacity"
            label="System Capacity (K)"
            value={capacity}
            onChange={onCapacityChange}
            showInfinity={true}
            onInfinityClick={handleCapacityInfinityClick}
            autoComplete="capacity"
            required={false}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MmSystemParameters;
