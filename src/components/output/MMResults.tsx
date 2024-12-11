import React from "react";
import { MMCharacteristics } from "@/types/mm";
import { toProperFraction } from "@/lib/math";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const MMResults = ({
  characteristics,
}: {
  characteristics: MMCharacteristics;
}) => {
  const rhoFraction = toProperFraction(characteristics.rho);
  const P0Fraction = toProperFraction(characteristics.P0);
  const LFraction = toProperFraction(characteristics.L);
  const LqFraction = toProperFraction(characteristics.Lq);
  const WFraction = toProperFraction(characteristics.W);
  const WqFraction = toProperFraction(characteristics.Wq);

  const formatFraction = (fraction: {
    numerator: number;
    denominator: number;
  }) => {
    if (fraction.denominator === 1) {
      return fraction.numerator.toString();
    }
    return `\\frac{${fraction.numerator}}{${fraction.denominator}}`;
  };

  return (
    <MathJaxContext>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1">
              System utilization (ρ):{" "}
              <MathJax
                inline
              >{`\\(\\rho = ${formatFraction(rhoFraction)}\\)`}</MathJax>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1">
              Probability of 0 customers (P0):{" "}
              <MathJax
                inline
              >{`\\(P_0 = ${formatFraction(P0Fraction)}\\)`}</MathJax>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1">
              Average number of customers in the system (L):{" "}
              <MathJax
                inline
              >{`\\(L = ${formatFraction(LFraction)}\\)`}</MathJax>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1">
              Average number of customers in the queue (Lq):{" "}
              <MathJax
                inline
              >{`\\(L_q = ${formatFraction(LqFraction)}\\)`}</MathJax>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1">
              Average time a customer spends in the system (W):{" "}
              <MathJax
                inline
              >{`\\(W = ${formatFraction(WFraction)}\\)`}</MathJax>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1">
              Average time a customer spends in the queue (Wq):{" "}
              <MathJax
                inline
              >{`\\(W_q = ${formatFraction(WqFraction)}\\)`}</MathJax>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </MathJaxContext>
  );
};

export default MMResults;
