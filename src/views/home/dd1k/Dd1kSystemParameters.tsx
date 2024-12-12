import { Box } from "@mui/material";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import InfinityLinkIndicator from "@/components/base/InfinityLinkIndicator";
import { evaluate } from "mathjs"; // Import evaluate from mathjs
import { isValidNaturalNumber, isValidPositiveInteger } from "@/lib/math";
import { NoNumberArrowsTextField } from "@/components/base/NoNumberArrowsTextField";
import { dd1kCapacityKey } from "./Dd1kCalculator";
import { getFromLocalStorage } from "@/utils/localstorage";

type Dd1kSystemParametersProps = {
  setCapacity: Dispatch<SetStateAction<string>>;
  capacity: string;
};

const Dd1kSystemParameters: React.FC<Dd1kSystemParametersProps> = ({
  setCapacity,
  capacity,
}) => {
  const [buffer, setBuffer] = useState<string>("");

  useEffect(() => {
    const capacity = getFromLocalStorage(dd1kCapacityKey, "");
    const evaluatedCapacity = evaluate(capacity);
    if (isValidPositiveInteger(evaluatedCapacity)) {
      setCapacity(evaluatedCapacity);
      setBuffer((evaluatedCapacity - 1).toString());
    }
  }, [setCapacity, setBuffer]);

  const onCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCapacity(value);
    try {
      if (value === "") {
        setBuffer("");
        return;
      }
      const evaluatedCapacity = evaluate(value);
      if (isValidPositiveInteger(evaluatedCapacity)) {
        setBuffer((evaluatedCapacity - 1).toString());
      }
    } catch {
      return; // Do not update state if evaluation fails
    }
  };

  const onBufferChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBuffer(value);
    try {
      if (value === "") {
        setCapacity("");
        return;
      }
      const evaluatedBuffer = evaluate(value.toString());
      if (isValidNaturalNumber(evaluatedBuffer)) {
        setCapacity((evaluatedBuffer + 1).toString());
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
              id="buffer"
              label="Buffer (K-1)"
              value={buffer}
              onChange={onBufferChange}
              autoComplete="dd1k-buffer"
              required={true}
              fullWidth
            />
          </Grid>
          {/* System Capacity */}
          <Grid size={{ xs: 12 }}>
            <NoNumberArrowsTextField
              id="capacity"
              label="Capacity (K)"
              value={capacity}
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
