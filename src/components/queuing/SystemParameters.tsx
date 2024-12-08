import { TextField, IconButton, Box } from "@mui/material";
import { useState, useMemo, Dispatch, SetStateAction } from "react";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/system";
import { InfinityIcon } from "lucide-react";
import { Process } from "@/types/queue";
import InfinityLinkIndicator from "../InfinityLinkIndicator";

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

type InputWithInfinityProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  showInfinity?: boolean;
  onInfinityClick?: () => void;
  required?: boolean;
  autoComplete?: string;
  onBlur?: () => void;
};

const NoNumberArrowsTextField = styled(TextField)({
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    {
      WebkitAppearance: "none",
      margin: 0,
    },
});

const InputWithInfinity: React.FC<InputWithInfinityProps> = ({
  id,
  label,
  value,
  onChange,
  showInfinity = true,
  onInfinityClick = () => {},
  required = false,
  autoComplete,
  onBlur,
}) => {
  const [error, setError] = useState(false);

  const handleBlur = () => {
    console.log("handleBlur: ", value);
    setError(required && isNaN(value));
    if (onBlur) {
      onBlur();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    onChange(newValue);
  };

  return (
    <NoNumberArrowsTextField
      id={id}
      value={isNaN(value) ? "" : value.toString()}
      placeholder="∞"
      label={label}
      type="number"
      fullWidth
      required={required}
      autoComplete={autoComplete}
      onChange={handleChange}
      size="small"
      error={error}
      onBlur={handleBlur}
      slotProps={{
        input: {
          endAdornment: showInfinity && (
            <IconButton
              color="primary"
              onClick={onInfinityClick}
              sx={{ minWidth: "40px" }}
            >
              <InfinityIcon />
            </IconButton>
          ),
        },
      }}
    />
  );
};

export default SystemParameters;
