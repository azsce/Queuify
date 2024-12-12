import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Process } from "@/types/queue";

type ProcessTypeSelectorProps = {
  processType: Process;
  setProcessType: (type: Process) => void;
};

const ProcessTypeSelector: React.FC<ProcessTypeSelectorProps> = ({
  processType,
  setProcessType,
}) => {
  const [defaultProcess] = useState(processType);
  return (
    <Grid size={{ xs: 12, sm: 6 }} container spacing={0} alignItems="start">
      {/* Empty Column */}
      <Grid size={1} />
      <Grid size={11}>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            mx: { xs: 0, sm: 4 },
            justifyContent: { xs: "space-between", md: "center" },
            gap: { xs: 2, md: 12 },
          }}
        >
          <FormLabel
            sx={{
              color: "text.primary",
              fontWeight: "bold",
            }}
          >
            Select{" "}
            <Typography variant="h6" display={"inline"}>
              Q
            </Typography>{" "}
            Type
          </FormLabel>
          <RadioGroup
            defaultValue={defaultProcess}
            onChange={(e) => setProcessType(e.target.value as Process)}
            row
            sx={{ justifyContent: "flex-end" }}
          >
            <FormControlLabel
              value="M/M/X/Y"
              control={<Radio />}
              label="M / M / X / Y"
            />
            <FormControlLabel
              value="D/D/1/K-1"
              control={<Radio />}
              label="D / D / 1 / K-1"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ProcessTypeSelector;
