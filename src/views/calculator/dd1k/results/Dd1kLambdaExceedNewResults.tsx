import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Box, Divider, Typography } from "@mui/material";
import { N_Of_T } from "@/types/dd1k";

import { NoNumberArrowsTextField } from "../../../../components/base/NoNumberArrowsTextField";
import { JSX, useEffect, useState } from "react";
import Dd1k from "@/class/dd1k/Dd1k";
import {
  formatFraction,
  isDecimalZeroAfterRounding,
  roundTo4Decimals,
  toProperFraction,
} from "@/lib/math";

type Wq_Of_N = {
  n0: string; // n = 0
  n_LessThan_LambdaTi: string; // n < λ*t_i
  nGreaterThanOrEqualLambdaTi: JSX.Element; // n ≥ λ*t_i
};

type Dd1kLambdaExceedNewResultsProps = {
  dd1k: Dd1k;
};

const Dd1kLambdaExceedNewResults: React.FC<Dd1kLambdaExceedNewResultsProps> = ({
  dd1k,
}) => {
  const {
    serviceRate,
    serviceTime,
    arrivalRate,
    arrivalTime,
    arrivalRateFraction,
    serviceRateFraction,
    capacity,
    timeSpecialValue: t_i,
    lambdaTiFloored,
    dd1kType: type,
  } = dd1k;

  useEffect(() => {
    // eslint-disable-next-line
    window.MathJax && window.MathJax.typeset();
  }, [dd1k]);

  const kMinus1 = capacity - 1;
  const kMinus2 = capacity - 2;

  let t_greaterOrEqual_ti = "";
  if (type === "λ > μ") {
    t_greaterOrEqual_ti = `\\text{ alternates between } ${kMinus1} \\text{ and } ${kMinus2}`;
  } else if (type === "(λ > μ) && λ%μ = 0") {
    t_greaterOrEqual_ti = `\\text{ = } ${kMinus1}`;
  }

  const lambdaByNew = arrivalRate / serviceRate;

  /**
   * 1. For t < 1/λ, n(t) = 0 (queue is empty).
   * 2. For 1/λ ≤ t < t_i, n(t) increases based on arrival and service rates typically calculated as:
   *                    n(t) = ⌊t/λ⌋ - ⌊t/μ - λ/μ⌋
   * 3. For t ≥ t_i, n(t) stabilizes at k-1 or k-2 customers.
   */
  const n_t: N_Of_T = {
    t_lessThan_arrivalTime: `0`,
    t_between_arrivalTime_and_ti: `
     ⌊${
       arrivalRate === 1
         ? "t"
         : isDecimalZeroAfterRounding(arrivalRate)
           ? roundTo4Decimals(arrivalRate) + "\\cdot t"
           : arrivalRateFraction.numerator === 1
             ? `\\frac{t}{${arrivalRateFraction.denominator}}`
             : formatFraction(arrivalRateFraction) + "\\cdot t"
     }⌋ -
     ⌊${
       serviceRate === 1
         ? "t"
         : isDecimalZeroAfterRounding(serviceRate)
           ? roundTo4Decimals(serviceRate) + "\\cdot t"
           : serviceRateFraction.numerator === 1
             ? `\\frac{t}{${serviceRateFraction.denominator}}`
             : formatFraction(serviceRateFraction) + "\\cdot t"
     } -
     ${formatFraction(toProperFraction(lambdaByNew))}⌋
    `,
    t_greaterOrEqual_ti: t_greaterOrEqual_ti,
  };

  const service_minus_arrival_time = serviceTime - arrivalTime;
  const service_minus_arrival_time_fraction = toProperFraction(
    service_minus_arrival_time
  );

  const lambdaTi =
    arrivalRate === 1
      ? "t_i"
      : isDecimalZeroAfterRounding(arrivalRate)
        ? roundTo4Decimals(arrivalRate) + "\\cdot t_i"
        : arrivalRateFraction.numerator === 1
          ? `\\frac{t_i}{${arrivalRateFraction.denominator}}`
          : formatFraction(arrivalRateFraction) + "\\cdot t_i";

  let nGreaterThanOrEqualLambdaTi: JSX.Element = null;
  if (type === "λ > μ") {
    nGreaterThanOrEqualLambdaTi = (
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
        }}
      >
        <MathJax inline>
          {`\\(Wq(n) ${`
                  \\text{ alternates between }
                  ${service_minus_arrival_time} \\cdot (${lambdaTi}- 2)`} \\text{,  } \\)`}
        </MathJax>
        <Box sx={{ ml: { xs: 2, sm: 0 } }}>
          <MathJax inline>
            {`\\(${`${service_minus_arrival_time} \\cdot (${lambdaTi}- 3)`}\\)`}
          </MathJax>
        </Box>
      </Box>
    );
  } else if (type === "(λ > μ) && λ%μ = 0") {
    nGreaterThanOrEqualLambdaTi = (
      <MathJax inline>
        {`\\(Wq(n) \\text{ = } ${service_minus_arrival_time}(${lambdaTi} - 2)\\)`}
      </MathJax>
    );
  }

  const wqOfN: Wq_Of_N = {
    n0: "0",
    n_LessThan_LambdaTi:
      service_minus_arrival_time === 1
        ? "(n - 1)"
        : isDecimalZeroAfterRounding(service_minus_arrival_time)
          ? roundTo4Decimals(service_minus_arrival_time) + "\\cdot (n - 1)"
          : service_minus_arrival_time_fraction.numerator === 1
            ? `\\frac{(n - 1)}{${service_minus_arrival_time_fraction.denominator}}`
            : formatFraction(service_minus_arrival_time_fraction) +
              "\\cdot (n - 1)",
    nGreaterThanOrEqualLambdaTi: nGreaterThanOrEqualLambdaTi,
  };

  let caseOutput = "";
  if (type === "λ > μ") {
    caseOutput = "\\lambda > \\mu";
  } else if (type === "(λ > μ) && λ%μ = 0") {
    caseOutput = "(\\lambda > \\mu) \\text{ and } (\\lambda \\% \\mu = 0)";
  }

  const [tVar, setTVar] = useState<number | undefined>(t_i);
  const [nOfTVar, setNOfTVar] = useState<number>(dd1k.computeNOfT(t_i));
  const [nVar, setNVar] = useState<number | undefined>(lambdaTiFloored);
  const [wqOfNVar, setWqOfNVar] = useState<number | undefined>(
    dd1k.waitingTimeForNthCustomer(lambdaTiFloored)
  );

  useEffect(() => {
    setTVar(dd1k.timeSpecialValue);
    setNOfTVar(dd1k.computeNOfT(dd1k.timeSpecialValue));
  }, [dd1k]);

  useEffect(() => {
    setNVar(dd1k.lambdaTiFloored);
    setWqOfNVar(dd1k.waitingTimeForNthCustomer(dd1k.lambdaTiFloored));
  }, [dd1k]);

  const handleTVarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    setTVar(t);
    const nOfT = dd1k.computeNOfT(t);
    setNOfTVar(nOfT);
  };

  const handleNVarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseFloat(e.target.value);
    setNVar(n);
    const wqOfN = dd1k.waitingTimeForNthCustomer(n);
    setWqOfNVar(wqOfN);
  };

  return (
    <MathJaxContext>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, md: 4 },
        }}
      >
        {/* Main header with title */}
        <Box
          className="text-center mb-6"
          sx={{
            display: "flex",
            gap: { xs: 2, md: 4 },
            mb: 2,
            mx: { xs: 1, sm: 0 },
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.5rem",
                md: "1.75rem",
                lg: "2rem",
                xl: "2.25rem",
              },
              maxLines: 1,
            }}
          >
            System Characteristics for
          </Typography>
          <MathJax inline>{`\\(D/D/1/(k-1)\\)`}</MathJax>
        </Box>

        <Divider />

        {/* Section for displaying λ, μ, and system capacity (K) */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">Note:</Typography>
            <MathJax inline>{`\\(${caseOutput}\\)`}</MathJax>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">Arrival Rate: </Typography>
            <MathJax
              inline
            >{`\\(\\lambda = ${formatFraction(arrivalRateFraction)}\\)`}</MathJax>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">Service Rate: </Typography>
            <MathJax
              inline
            >{`\\(\\mu = ${formatFraction(serviceRateFraction)}\\)`}</MathJax>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">Capacity: </Typography>
            <MathJax inline>{`\\(K = ${capacity}\\)`}</MathJax>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">Time of First Balk:</Typography>
            <MathJax inline>{`\\(t_i = ${t_i}\\)`}</MathJax>
          </Box>
        </Box>

        <Divider />

        {/* Section for displaying n(t) */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1">
            Number of Customers: <MathJax inline>{`\\(n(t)\\)`}</MathJax>
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4, ml: 4 }}>
            {/* n(t): t < 1/λ */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MathJax>{`\\( \\text{For }t < \\frac{1}{\\lambda}:\\)`}</MathJax>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, ml: 4 }}
              >
                <MathJax
                  inline
                >{`\\(n(t) = ${n_t.t_lessThan_arrivalTime}\\)`}</MathJax>
              </Box>
            </Box>

            {/* n(t): 1/λ ≤ t < t_i */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MathJax>{`\\( \\text{For } 1/\\lambda \\leq t < t_i:\\)`}</MathJax>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, ml: 4 }}
              >
                <MathJax>{`\\(n(t) = ${n_t.t_between_arrivalTime_and_ti}\\)`}</MathJax>
              </Box>
            </Box>

            {/* n(t): t ≥ t_i */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MathJax>{`\\( \\text{For }t \\geq t_i:\\)`}</MathJax>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, ml: 4 }}
              >
                <MathJax>{`\\(n(t) ${n_t.t_greaterOrEqual_ti}\\)`}</MathJax>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              pt: 2,
            }}
          >
            <MathJax inline>{`\\( n(t)\\)`}</MathJax>
            <NoNumberArrowsTextField
              label="t ="
              placeholder="t = "
              value={isNaN(tVar) ? "" : tVar}
              type="number"
              variant="outlined"
              onChange={handleTVarChange}
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography
                      sx={{
                        minWidth: "50%",
                        borderLeft: "1px solid",
                        borderColor: "text.primary",
                        paddingLeft: "1rem",
                        color: "text.primary",
                      }}
                    >
                      = {nOfTVar}
                    </Typography>
                  ),
                },
              }}
            ></NoNumberArrowsTextField>
          </Box>
        </Box>

        <Divider />

        {/* Section for displaying Wq(n) */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1">
            Waiting Time: <MathJax inline>{`\\(Wq(n)\\)`}</MathJax>
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4, ml: 4 }}>
            {/* Wq(n): n = 0 */}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, ml: 4 }}
            >
              <MathJax>{`\\( \\text{For }n = 0:\\)`}</MathJax>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, ml: 4 }}
              >
                <MathJax inline>{`\\(Wq(n) = ${wqOfN.n0}\\)`}</MathJax>
              </Box>
            </Box>

            {/* Wq(n): n < λt_i */}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, ml: 4 }}
            >
              <MathJax>{`\\( \\text{For }n < \\lambda t_i:\\)`}</MathJax>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, ml: 4 }}
              >
                <MathJax>{`\\(Wq(n) = ${wqOfN.n_LessThan_LambdaTi}\\)`}</MathJax>
              </Box>
            </Box>

            {/* Wq(n): n ≥ λt_i */}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, ml: 4 }}
            >
              <MathJax>{`\\( \\text{For }n \\geq \\lambda t_i:\\)`}</MathJax>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, ml: 4 }}
              >
                {wqOfN.nGreaterThanOrEqualLambdaTi}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              pt: 2,
              pb: 3,
            }}
          >
            <MathJax inline>{`\\(Wq(n) \\)`}</MathJax>
            <NoNumberArrowsTextField
              label="n ="
              placeholder="n = "
              value={isNaN(nVar) ? "" : nVar}
              type="number"
              variant="outlined"
              onChange={handleNVarChange}
              color="secondary"
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography
                      sx={{
                        minWidth: "50%",
                        borderLeft: "1px solid",
                        borderColor: "text.primary",
                        paddingLeft: "1rem",
                        color: "text.primary",
                      }}
                    >
                      Wq(n) = {wqOfNVar}
                    </Typography>
                  ),
                },
              }}
            ></NoNumberArrowsTextField>
          </Box>
        </Box>
      </Box>
    </MathJaxContext>
  );
};

export default Dd1kLambdaExceedNewResults;
