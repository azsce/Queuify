import { Box } from "@mui/material";
import { useState, Dispatch, SetStateAction } from "react";
import Grid from "@mui/material/Grid2";
import InfinityLinkIndicator from "@/components/base/InfinityLinkIndicator";
import { evaluate } from "mathjs"; // Import evaluate from mathjs
import { isValidPositiveValue } from "@/lib/math";
import { NoNumberArrowsTextField } from "@/components/base/NoNumberArrowsTextField";

type Dd1kSystemParametersProps = {
  setCapacity: Dispatch<SetStateAction<number>>;
  capacity: number;
};

const Dd1kSystemParameters: React.FC<Dd1kSystemParametersProps> = ({
  setCapacity,
  capacity,
}) => {
  const [capacityMinusOne, setCapacityMinusOne] = useState<number | undefined>(
    () => {
      if (capacity) {
        return capacity - 1;
      }
      return undefined;
    }
  );

  const onCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    try {
      if (value === "") {
        setCapacity(undefined);
        setCapacityMinusOne(undefined);
        return;
      }
      const evaluatedValue = evaluate(value.toString());
      if (
        isValidPositiveValue(evaluatedValue) &&
        Number.isInteger(evaluatedValue) &&
        evaluatedValue > 1
      ) {
        setCapacity(evaluatedValue);
        setCapacityMinusOne(evaluatedValue - 1);
      }
    } catch {
      return; // Do not update state if evaluation fails
    }
  };

  const onCapacityMinusOneChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    try {
      if (value === "") {
        setCapacityMinusOne(undefined);
        setCapacity(undefined);
        return;
      }
      const evaluatedValue = evaluate(value.toString());
      if (
        isValidPositiveValue(evaluatedValue) &&
        Number.isInteger(evaluatedValue) &&
        evaluatedValue >= 0
      ) {
        setCapacityMinusOne(evaluatedValue);
        setCapacity(evaluatedValue + 1);
      }
    } catch {
      return; // Do not update state if evaluation fails
    }
  };

  return (
    <Grid
      size={{ xs: 12, sm: 6 }}
      container
      alignItems="center"
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
          <Grid size={{ xs: 12 }}>
            <NoNumberArrowsTextField
              id="capacityMinusOne"
              label="K-1"
              value={isNaN(capacityMinusOne) ? "" : capacityMinusOne}
              onChange={onCapacityMinusOneChange}
              autoComplete="dd1k-capacity-1"
              required={true}
              fullWidth
            />
          </Grid>
          {/* System Capacity */}
          <Grid size={{ xs: 12 }}>
            <NoNumberArrowsTextField
              id="capacity"
              label="K (System Capacity)"
              value={isNaN(capacity) ? "" : capacity}
              onChange={onCapacityChange}
              autoComplete="dd1k-capacity"
              required={true}
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dd1kSystemParameters;
