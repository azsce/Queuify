import React from "react";
import { MMCharacteristics } from "@/types/mm";
import { formatFraction, toProperFraction } from "@/lib/math";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

function isDecimalZeroAfterRounding(num) {
  // Round the number to 4 decimal points
  const roundedNum = Math.round(num * 10000) / 10000;

  // Check if the decimal part is zero
  return roundedNum % 1 === 0;
}

function roundTo4Decimals(num) {
  // Round to 4 decimal places without adding trailing zeros
  return Math.round(num * 10000) / 10000;
}

const MMResults = ({
  characteristics,
}: {
  characteristics: MMCharacteristics;
}) => {
  const { rho, P0, L, Lq, W, Wq } = characteristics;
  const rhoFraction = toProperFraction(rho);
  const P0Fraction = toProperFraction(P0);
  const LFraction = toProperFraction(L);
  const LqFraction = toProperFraction(Lq);
  const WFraction = toProperFraction(W);
  const WqFraction = toProperFraction(Wq);

  return (
    <MathJaxContext>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            {/* ρ */}
            <Typography variant="body1">
              System utilization (ρ):{" "}
              {isDecimalZeroAfterRounding(rho) ? (
                <MathJax
                  inline
                >{`\\(\\rho = ${roundTo4Decimals(rho)}`}</MathJax>
              ) : (
                <MathJax
                  inline
                >{`\\(\\rho = ${formatFraction(rhoFraction)}\\) = ${roundTo4Decimals(rho)}`}</MathJax>
              )}
            </Typography>
          </Grid>

          {/* P0 */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1">
              Probability of 0 customers (P0):{" "}
              {isDecimalZeroAfterRounding(P0) ? (
                <MathJax
                  inline
                >{`\\(P_0 = ${roundTo4Decimals(P0)}\\)`}</MathJax>
              ) : (
                <MathJax
                  inline
                >{`\\(P_0 = ${formatFraction(P0Fraction)}\\) = ${roundTo4Decimals(P0)}`}</MathJax>
              )}
            </Typography>
          </Grid>

          {/* L */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1">
              Average number of customers in the system (L):{" "}
              {isDecimalZeroAfterRounding(L) ? (
                <MathJax inline>{`\\(L = ${roundTo4Decimals(L)}\\)`}</MathJax>
              ) : (
                <MathJax
                  inline
                >{`\\(L = ${formatFraction(LFraction)}\\) = ${roundTo4Decimals(L)}`}</MathJax>
              )}
            </Typography>
          </Grid>
          {/* Lq */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1">
              Average number of customers in the queue (Lq):{" "}
              {isDecimalZeroAfterRounding(Lq) ? (
                <MathJax
                  inline
                >{`\\(L_q = ${roundTo4Decimals(Lq)}\\)`}</MathJax>
              ) : (
                <MathJax
                  inline
                >{`\\(L_q = ${formatFraction(LqFraction)}\\) = ${roundTo4Decimals(Lq)}`}</MathJax>
              )}
            </Typography>
          </Grid>
          {/* W */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1">
              Average time a customer spends in the system (W):{" "}
              {isDecimalZeroAfterRounding(W) ? (
                <MathJax inline>{`\\(W = ${parseInt(W + "")}\\)`}</MathJax>
              ) : (
                <MathJax
                  inline
                >{`\\(W = ${formatFraction(WFraction)}\\) = ${roundTo4Decimals(W)}`}</MathJax>
              )}
            </Typography>
          </Grid>
          {/* Wq */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1">
              Average time a customer spends in the queue (Wq):{" "}
              {isDecimalZeroAfterRounding(Wq) ? (
                <MathJax
                  inline
                >{`\\(W_q = ${roundTo4Decimals(Wq)}\\)`}</MathJax>
              ) : (
                <MathJax
                  inline
                >{`\\(W_q = ${formatFraction(WqFraction)}\\) = ${roundTo4Decimals(Wq)}`}</MathJax>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </MathJaxContext>
  );
};

export default MMResults;
