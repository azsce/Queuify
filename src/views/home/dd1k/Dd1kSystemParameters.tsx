import { Box } from "@mui/material";
import { useState, Dispatch, SetStateAction } from "react";
import Grid from "@mui/material/Grid2";
import InputWithInfinity from "@/components/base/InputWithInfinity";
import InfinityLinkIndicator from "@/components/base/InfinityLinkIndicator";
import { evaluate } from "mathjs"; // Import evaluate from mathjs

type Dd1kSystemParametersProps = {
  setCapacity: Dispatch<SetStateAction<number>>;
  capacity: number;
};

const Dd1kSystemParameters: React.FC<Dd1kSystemParametersProps> = ({
  setCapacity,
  capacity,
}) => {
  const [capacityMinusOne, setCapacityMinusOne] = useState<number | undefined>(
    capacity - 1
  );

  const onCapacityChange = (value: number | string) => {
    console.log("value", value);
    if (value === "" || isNaN(value as number)) {
      setCapacity(undefined);
      setCapacityMinusOne(undefined);
      return;
    }
    try {
      const evaluatedValue = evaluate(value.toString());
      if (!Number.isInteger(evaluatedValue) || evaluatedValue <= 1) {
        return; // Ensure the value is a positive integer greater than 1
      }
      setCapacity(evaluatedValue);
      setCapacityMinusOne(evaluatedValue - 1);
    } catch {
      return; // Do not update state if evaluation fails
    }
  };

  const onCapacityMinusOneChange = (value: number | string) => {
    console.log("value", value);
    if (value === "" || isNaN(value as number)) {
      setCapacityMinusOne(undefined);
      setCapacity(undefined);
      return;
    }
    try {
      const evaluatedValue = evaluate(value.toString());
      if (!Number.isInteger(evaluatedValue) || evaluatedValue < 0) {
        return; // Ensure the value is a non-negative integer
      }
      setCapacityMinusOne(evaluatedValue);
      setCapacity(evaluatedValue + 1);
    } catch {
      return; // Do not update state if evaluation fails
    }
  };

  return (
    <Grid size={{ xs: 12, sm: 6 }} container alignItems="center"
    width={{ xs: "100%", sm: "50%" }}
    sx={{ paddingRight: { xs: 0, sm: 1 } }}
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
      <Grid size={11}>
        <Grid container spacing={2}>
          {/* System Capacity - 1 */}
          <Grid size={{ xs: 12, }}>
            <InputWithInfinity
              id="capacityMinusOne"
              label="K-1"
              value={capacityMinusOne}
              onChange={onCapacityMinusOneChange}
              autoComplete="capacity - 1"
              required={true}
              showInfinity={false}
            />
          </Grid>
          {/* System Capacity */}
          <Grid size={{ xs: 12 }}>
            <InputWithInfinity
              id="capacity"
              label="K (System Capacity)"
              value={capacity}
              onChange={onCapacityChange}
              autoComplete="capacity"
              required={true}
              showInfinity={false}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dd1kSystemParameters;
