import { Box } from "@mui/material";
import { useState, useMemo, Dispatch, SetStateAction } from "react";
import Grid from "@mui/material/Grid2";
import { Process } from "@/types/queue";
import InfinityLinkIndicator from "../InfinityLinkIndicator";
import InputWithInfinity from "../InputWithInfinity";

type SystemParametersProps = {
  setServers: Dispatch<SetStateAction<number>>;
  setCapacity: Dispatch<SetStateAction<number>>;
  servers: number;
  capacity: number;
  processType: Process;
};

const SystemParameters: React.FC<SystemParametersProps> = ({
  setServers,
  setCapacity,
  servers,
  capacity,
  processType,
}) => {
  const requiredServers = useMemo(() => processType === "D/D", [processType]);
  const requiredCapacity = useMemo(() => processType === "D/D", [processType]);

  const infinitableCapacity = useMemo(
    () => processType !== "D/D",
    [processType]
  );
  const infintableServers = useMemo(() => processType !== "D/D", [processType]);
  const [capacityMinusOne, setCapacityMinusOne] = useState<number>(
    capacity - 1
  );

  const onCapacityChange = (value: number) => {
    setCapacity(value);
    if (processType === "D/D") {
      if (isNaN(value)) {
        setCapacityMinusOne(undefined);
      }

      if (!isNaN(value) && value > 1) {
        setCapacityMinusOne(value - 1);
      }
    }
  };

  const onCapacityMinusOneChange = (value: number) => {
    setCapacityMinusOne(value);
    if (processType === "D/D") {
      if (isNaN(value)) {
        setCapacity(undefined);
      }

      if (!isNaN(value) && value >= 0) {
        setCapacity(value + 1);
      }
    }
  };

  const handleServersInfinityClick = () => {
    if (infintableServers) {
      setServers(null);
    }
  };

  const handleCapacityInfinityClick = () => {
    if (infinitableCapacity) {
      setCapacity(null);
    }
  };

  const handleCapacityMinusOneInfinityClick = () => {
    if (infinitableCapacity) {
      setCapacityMinusOne(null);
    }
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
            onChange={setServers}
            showInfinity={infintableServers}
            onInfinityClick={handleServersInfinityClick}
            autoComplete="servers"
            required={requiredServers}
          />
        </Grid>
      </Grid>

      {/* System Capacity and System Capacity - 1  and Infinite Link Indicator */}
      {processType === "D/D" ? (
        <Grid
          size={{ xs: 12, sm: 6 }}
          container
          spacing={0}
          alignItems="center"
        >
          {/* Infinite Link Indicator */}
          <Grid
            size={1}
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

          {/* System Capacity  - 1 and System Capacity */}
          <Grid size={{ xs: 11 }}>
            <Grid container spacing={2}>
              {/* System Capacity - 1 */}
              <Grid size={{ xs: 12 }}>
                <InputWithInfinity
                  id="capacityMinusOne"
                  label="K-1"
                  value={capacityMinusOne}
                  onChange={onCapacityMinusOneChange}
                  showInfinity={infinitableCapacity}
                  onInfinityClick={handleCapacityMinusOneInfinityClick}
                  autoComplete="capacity - 1"
                  required={requiredCapacity}
                />
              </Grid>
              {/* System Capacity */}
              <Grid size={{ xs: 12 }}>
                <InputWithInfinity
                  id="capacity"
                  label="K (System Capacity)"
                  value={capacity}
                  onChange={onCapacityChange}
                  showInfinity={infinitableCapacity}
                  onInfinityClick={handleCapacityInfinityClick}
                  autoComplete="capacity"
                  required={requiredCapacity}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid size={{ xs: 12, sm: 6 }} container spacing={0} alignItems="start">
          {/* Empty Column */}
          <Grid size={1} />
          <Grid size={11}>
            <InputWithInfinity
              id="capacity"
              label="System Capacity (K)"
              value={capacity}
              onChange={onCapacityChange}
              showInfinity={infinitableCapacity}
              onInfinityClick={handleCapacityInfinityClick}
              autoComplete="capacity"
              required={requiredCapacity}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default SystemParameters;
