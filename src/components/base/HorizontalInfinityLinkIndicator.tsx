import React from "react";
import { Box } from "@mui/material";
import { Link as LinkIcon } from "lucide-react";

const HorizontalInfinityLinkIndicator: React.FC = () => {


  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        pointerEvents: "none",
        gap: 1,
      }}
    >

      {/* Infinity Link Icon */}
      <Box
        sx={{
          color: "#aaa",
          height: "25%",
        }}
      >
        <LinkIcon size={16} />
      </Box>

    </Box>
  );
};

export default HorizontalInfinityLinkIndicator;
