import { Box, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid2";
import VerticalInfinityLinkIndicator from "@/components/base/VerticalInfinityLinkIndicator";
import { evaluate } from "mathjs"; // Import evaluate from mathjs
import { isValidNaturalNumber, isValidPositiveInteger } from "@/lib/math";
import { NoNumberArrowsTextField } from "@/components/base/NoNumberArrowsTextField";
import HorizontalInfinityLinkIndicator from "@/components/base/HorizontalInfinityLinkIndicator";
import { useDD1K } from "@/contexts/DD1KContext";

const Dd1kSystemParameters: React.FC = () => {
  const { capacity, setCapacity, buffer, setBuffer } = useDD1K();

  const onCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCapacity(value);

    if (value === "") {
      setBuffer("");
      return;
    }

    try {
      const evaluatedCapacity = evaluate(value.toString());
      if (isValidPositiveInteger(evaluatedCapacity)) {
        setBuffer((evaluatedCapacity - 1).toString());
      }
    } catch {
      return;
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
      return;
    }
  };

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Grid
      size={{ xs: 12, sm: 6 }}
      container
      spacing={0}
      alignItems="center"
      width={{ xs: "100%", sm: "100%" }}
      sx={{ paddingRight: { xs: 0, sm: 0 } }}
    >
      {/* Infinite Link Indicator */}
      <Grid size={{ xs: 1, sm: 0.5 }}>
        {isMobile && (
          <Box
            sx={{
              position: "relative",
              display: { xs: "flex", sm: "none" },
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <VerticalInfinityLinkIndicator />
          </Box>
        )}
      </Grid>

      {/* System Capacity Inputs */}
      <Grid size={{ xs: 11, sm: 11.5 }}>
        <Grid container spacing={1}>
          {/* Buffer (K-1) */}
          <Grid size={{ xs: 12, sm: 5.65 }}>
            <NoNumberArrowsTextField
              id="buffer"
              label="Buffer (K-1)"
              placeholder="K-1"
              value={buffer}
              onChange={onBufferChange}
              autoComplete="dd1k-buffer"
              required={true}
              fullWidth
            />
          </Grid>
          {/* Empty space */}
          <Grid size={{ xs: 0, sm: 0.7 }}>
            <Box
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                width: "100%",
                height: "100%",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <HorizontalInfinityLinkIndicator />
            </Box>
          </Grid>
          {/* Capacity (K) */}
          <Grid size={{ xs: 12, sm: 5.65 }}>
            <NoNumberArrowsTextField
              id="capacity"
              label="Capacity (K)"
              placeholder="K-1"
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
