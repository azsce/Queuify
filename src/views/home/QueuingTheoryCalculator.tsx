"use client";

import React, { useState } from "react";
import ProcessTypeSelector from "@/components/input/ProcessTypeSelector";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Container,
  Typography,
} from "@mui/material";
import { Process } from "@/types/queue";
import Dd1kCalculator from "./dd1k/Dd1kCalculator";
import MMCalculator from "./mm/MMCalculator";

const QueuingTheoryCalculator: React.FC = () => {
  const [processType, setProcessType] = useState<Process>("D/D/1/K-1");

  return (
    <Container
      // maxWidth="lg"
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
        <ProcessTypeSelector setProcessType={setProcessType} />
        {processType === "D/D/1/K-1" ? <Dd1kCalculator /> : <MMCalculator />}
      </Box>
    </Container>
  );
};

export default QueuingTheoryCalculator;
