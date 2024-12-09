import { IconButton } from "@mui/material";
import { InfinityIcon } from "lucide-react";
import React, { useState } from "react";
import { NoNumberArrowsTextField } from "./NoNumberArrowsTextField";

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

export default InputWithInfinity;
