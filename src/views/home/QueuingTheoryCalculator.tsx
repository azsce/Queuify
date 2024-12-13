"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProcessTypeSelector from "@/components/input/ProcessTypeSelector";
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

  // Transition variants for the calculator
  const calculatorVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.95,
      y: 20 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

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
        
        <AnimatePresence mode="wait">
          <motion.div
            key={processType}
            variants={calculatorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {processType === "D/D/1/K-1" ? <Dd1kCalculator /> : <MMCalculator />}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Container>
  );
};

export default QueuingTheoryCalculator;