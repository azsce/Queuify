import { TextField } from "@mui/material";
import { styled } from "@mui/system";

export const NoNumberArrowsTextField = styled(TextField)({
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    {
      WebkitAppearance: "none",
      margin: 0,
    },
});
