import { Process } from "@/types/queue";
import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid2";

type ProcessTypeSelectorProps = {
  setProcessType: (type: Process) => void;
};

const ProcessTypeSelector: React.FC<ProcessTypeSelectorProps> = ({
  setProcessType,
}) => {
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
          <FormLabel>Queue Type</FormLabel>
          <RadioGroup
            defaultValue="D/D"
            onChange={(e) => setProcessType(e.target.value as Process)}
            row
            sx={{ justifyContent: "flex-end" }}
          >
            <FormControlLabel value="M/M" control={<Radio />} label="M/M" />
            <FormControlLabel value="D/D" control={<Radio />} label="D/D" />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ProcessTypeSelector;
