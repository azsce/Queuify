import React, { useEffect } from "react";
import { MMCharacteristics } from "@/types/mm";
import {
  formatFraction,
  toProperFraction,
  isDecimalZeroAfterRounding,
  roundTo4Decimals,
} from "@/lib/math";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Box, Tooltip, Typography } from "@mui/material";


const MMResults = ({
  characteristics: performanceMetrics,
}: {
  characteristics: MMCharacteristics;
}) => {
  useEffect(() => {
    // eslint-disable-next-line
    window.MathJax && window.MathJax.typeset();
  }, [performanceMetrics]);

  const { rho, P0, L, Lq, W, Wq } = performanceMetrics;
  const rhoFraction = toProperFraction(rho);
  const P0Fraction = toProperFraction(P0);
  const LFraction = toProperFraction(L);
  const LqFraction = toProperFraction(Lq);
  const WFraction = toProperFraction(W);
  const WqFraction = toProperFraction(Wq);


  return (
    <MathJaxContext>
      <Box
        sx={{
          p: 2,
          pl: 8,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* ρ */}
        <Tooltip title="System utilization" followCursor>
          <Typography variant="body1">
            {isDecimalZeroAfterRounding(rho) ? (
              <MathJax
                inline
              >{`\\(\\rho = ${roundTo4Decimals(rho)}\\)`}</MathJax>
            ) : (
              <MathJax inline>
                {`\\(\\rho = ${formatFraction(rhoFraction)}\\) = ${roundTo4Decimals(
                  rho
                )}`}
              </MathJax>
            )}
          </Typography>
        </Tooltip>

        {/* P0 */}
        <Tooltip title="Probability of 0 customers" followCursor>
          <Typography variant="body1">
            {isDecimalZeroAfterRounding(P0) ? (
              <MathJax inline>{`\\(P_0 = ${roundTo4Decimals(P0)}\\)`}</MathJax>
            ) : (
              <MathJax inline>
                {`\\(P_0 = ${formatFraction(P0Fraction)}\\) = ${roundTo4Decimals(
                  P0
                )}`}
              </MathJax>
            )}
          </Typography>
        </Tooltip>

        {/* L */}
        <Tooltip title="Average number of customers in the system" followCursor>
          <Typography variant="body1">
            {isDecimalZeroAfterRounding(L) ? (
              <MathJax inline>{`\\(L = ${roundTo4Decimals(L)}\\)`}</MathJax>
            ) : (
              <MathJax inline>
                {`\\(L = ${formatFraction(LFraction)}\\) = ${roundTo4Decimals(L)}`}
              </MathJax>
            )}
          </Typography>
        </Tooltip>

        {/* Lq */}
        <Tooltip title="Average number of customers in the queue" followCursor>
          <Typography variant="body1">
            {isDecimalZeroAfterRounding(Lq) ? (
              <MathJax inline>{`\\(L_q = ${roundTo4Decimals(Lq)}\\)`}</MathJax>
            ) : (
              <MathJax inline>
                {`\\(L_q = ${formatFraction(LqFraction)}\\) = ${roundTo4Decimals(
                  Lq
                )}`}
              </MathJax>
            )}
          </Typography>
        </Tooltip>

        {/* W */}
        <Tooltip
          title="Average time a customer spends in the system"
          followCursor
        >
          <Typography variant="body1">
            {isDecimalZeroAfterRounding(W) ? (
              <MathJax inline>{`\\(W = ${parseInt(W + "")}\\)`}</MathJax>
            ) : (
              <MathJax inline>
                {`\\(W = ${formatFraction(WFraction)}\\) = ${roundTo4Decimals(W)}`}
              </MathJax>
            )}
          </Typography>
        </Tooltip>

        {/* Wq */}
        <Tooltip
          title="Average time a customer spends in the queue"
          followCursor
        >
          <Typography variant="body1">
            {isDecimalZeroAfterRounding(Wq) ? (
              <MathJax inline>{`\\(W_q = ${roundTo4Decimals(Wq)}\\)`}</MathJax>
            ) : (
              <MathJax inline>
                {`\\(W_q = ${formatFraction(WqFraction)}\\) = ${roundTo4Decimals(
                  Wq
                )}`}
              </MathJax>
            )}
          </Typography>
        </Tooltip>

        <Box sx={{ height: "30vh" }} />
      </Box>
    </MathJaxContext>
  );
};

export default MMResults;
