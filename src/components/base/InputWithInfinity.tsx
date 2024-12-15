import { IconButton } from "@mui/material";
import { InfinityIcon } from "lucide-react";
import React from "react";
import { NoNumberArrowsTextField } from "./NoNumberArrowsTextField";

type InputWithInfinityProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showInfinity?: boolean;
  onInfinityClick?: () => void;
  required?: boolean;
  autoComplete?: string;
};

const InputWithInfinity: React.FC<InputWithInfinityProps> = ({
  id,
  label,
  value,
  onChange,
  showInfinity = true,
  onInfinityClick = () => {},
  required = false,
  autoComplete,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <NoNumberArrowsTextField
      id={id}
      value={value}
      placeholder={showInfinity ? "∞" : ""}
      label={label}
      fullWidth
      required={required}
      autoComplete={autoComplete}
      onChange={handleChange}
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

export default InputWithInfinity;
