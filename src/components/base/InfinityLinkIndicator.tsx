import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { Link as LinkIcon } from "lucide-react";

const InfinityLinkIndicator: React.FC = () => {
  const [containerHeight, setContainerHeight] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, [containerRef]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
        gap: 1,
      }}
      ref={containerRef}
    >
      {/* Top */}
      <Box
        sx={{
          width: "50%",
          height: `${containerHeight * 0.4}px`,
          borderTop: "3px solid #aaa",
          borderLeft: "3px solid #aaa",
        }}
      />

      {/* Infinity Link Icon */}
      <Box
        sx={{
          color: "#aaa",
          height: "25%",
        }}
      >
        <LinkIcon size={16} />
      </Box>

      {/* Bottom */}
      <Box
        sx={{
          width: "50%",
          height: `${containerHeight * 0.4}px`,

          borderBottom: "3px solid #aaa",
          borderLeft: "3px solid #aaa",
        }}
      />
    </Box>
  );
};

export default InfinityLinkIndicator;
