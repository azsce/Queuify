"use client";

import React, { useEffect, useState } from "react";
import ProcessTypeSelector from "@/views/calculator/components/input/ProcessTypeSelector";
import { Box, Container, Typography } from "@mui/material";
import Dd1kCalculator from "./dd1k/Dd1kCalculator";
import MMCalculator from "./mm/MMCalculator";
import { Process } from "@/types/queue";

const QueuingTheoryCalculator: React.FC = () => {
  const [processType, setProcessType] = useState<Process>(() => {
    const storedValue = localStorage.getItem("processType") as Process;
    return storedValue ? storedValue : ("M/M/X/Y" as Process);
  });

  useEffect(() => {
    localStorage.setItem("processType", processType);
  }, [processType]);

  return (
    <Container
      sx={(theme) => ({
        py: 4,
        maxWidth: "100%",
        [theme.breakpoints.up("xs")]: {
          maxWidth: "95%",
        },
        [theme.breakpoints.up("sm")]: {
          maxWidth: theme.breakpoints.values.lg,
        },
        [theme.breakpoints.up("md")]: {
          maxWidth: theme.breakpoints.values.md,
        },
        marginLeft: "auto",
        marginRight: "auto",
        t: 0,
        p: 0,
        borderRadius: 0,
      })}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 600,
          fontSize: { xs: "1.2rem", sm: "1.8rem", md: "2.25rem" },
          textAlign: "center",
          mt: 4,
          mb: 2,
          borderBottom: 1,
          borderColor: "divider",
          pb: 2,
        }}
      >
        Queue Performance Analyzer
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <ProcessTypeSelector
          processType={processType}
          setProcessType={setProcessType}
        />

        <Box>
          <div
            style={{
              opacity: processType === "D/D/1/K-1" ? 1 : 0,
              transform:
                processType === "D/D/1/K-1"
                  ? "scale(1) translateY(0)"
                  : "scale(0.9) translateY(20px)",
              pointerEvents: processType === "D/D/1/K-1" ? "auto" : "none",
              transition:
                "opacity 0.3s ease, transform 0.3s ease, pointer-events 0.3s ease, height 0.3s ease",
              height: processType === "D/D/1/K-1" ? "auto" : "0", // auto when visible, 0 when hidden
              overflow: processType === "D/D/1/K-1" ? "visible" : "hidden", // prevent content overflow when hidden
              width: "100%",
            }}
          >
            <Dd1kCalculator />
          </div>

          <div
            style={{
              opacity: processType === "M/M/X/Y" ? 1 : 0,
              transform:
                processType === "M/M/X/Y"
                  ? "scale(1) translateY(0)"
                  : "scale(0.9) translateY(20px)",
              pointerEvents: processType === "M/M/X/Y" ? "auto" : "none",
              transition:
                "opacity 0.3s ease, transform 0.3s ease, pointer-events 0.3s ease, height 0.3s ease",
              height: processType === "M/M/X/Y" ? "auto" : "0", // auto when visible, 0 when hidden
              overflow: processType === "M/M/X/Y" ? "visible" : "hidden", // prevent content overflow when hidden
              width: "100%",
            }}
          >
            <MMCalculator />
          </div>
        </Box>
      </Box>
    </Container>
  );
};

export default QueuingTheoryCalculator;
