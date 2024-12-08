import { Process, ProcessEnum } from "@/types/queue";
import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import React from "react";

type ProcessTypeSelectorProps = {
  setProcessType: (type: Process) => void;
};

const ProcessTypeSelector: React.FC<ProcessTypeSelectorProps> = ({
  setProcessType,
}) => {
  return (
    <FormControl
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        mx: { xs: 0, sm: 4},
        justifyContent: { xs: "space-between", md: "center" },
        gap: { xs: 2, md: 12 },
      }}
    >
      <FormLabel>Queue Type</FormLabel>
      <RadioGroup
        defaultValue={ProcessEnum.D_D}
        onChange={(e) => setProcessType(e.target.value as Process)}
        row
        sx={{ justifyContent: "flex-end" }}
      >
        <FormControlLabel value="M/M" control={<Radio />} label="M/M" />
        <FormControlLabel value="D/D" control={<Radio />} label="D/D" />
      </RadioGroup>
    </FormControl>
  );
};

export default ProcessTypeSelector;
