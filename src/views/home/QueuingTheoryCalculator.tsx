"use client";

import { useState } from "react";
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
import DD1KCalculator from "./dd1k/DD1KCalculator";
import MMCalculator from "./mm/MMCalculator";

export default function QueuingTheoryCalculator() {
  const [processType, setProcessType] = useState<Process>("D/D/1/K-1");

  return (
    <Container
      // maxWidth="lg"
      sx={(theme) => ({
        py: 4,
        maxWidth: "100%",
        [theme.breakpoints.up("xs")]: {
          maxWidth: "100%",
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
      <Card
        sx={{
          mt: 0,
          p: 0,
          borderRadius: 0,
          height: "100%",
          minHeight: "100vh",
          boxShadow: "none",
        }}
      >
        <CardHeader></CardHeader>
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.2rem", sm: "1.8rem", md: "2.25rem" },
              textAlign: "center",
              mt: 0,
              mb: 2,
              borderBottom: 1,
              borderColor: "divider",
              pb: 2,
            }}
          >
            Queuing Theory Calculator
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <ProcessTypeSelector setProcessType={setProcessType} />
            {processType === "D/D/1/K-1" ? (
              <DD1KCalculator />
            ) : (
              <MMCalculator />
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
