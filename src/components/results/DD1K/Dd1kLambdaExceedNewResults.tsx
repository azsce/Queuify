import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Box, Divider, Typography } from "@mui/material";
import { N_Of_T } from "@/types/dd1k";

import { NoNumberArrowsTextField } from "../../base/NoNumberArrowsTextField";
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
    t_i,
    lambdaTiFloored,
    type,
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
      <div>
        <MathJax inline>
          {`\\(Wq(n) ${`
                  \\text{ alternates between }
                  ${service_minus_arrival_time} \\cdot (${lambdaTi}- 2)`}\\)`}
        </MathJax>
        <MathJax inline>
          {`\\( \\text{ }\\text{ }\\text{  and  }\\text{ }\\text{ } ${`${service_minus_arrival_time} \\cdot (${lambdaTi}- 3)`}\\)`}
        </MathJax>
      </div>
    );
  } else if (type === "(λ > μ) && λ%μ = 0") {
    nGreaterThanOrEqualLambdaTi = (
      <MathJax inline>
        {`\\(Wq(n) \\text{ = } ${service_minus_arrival_time}(${lambdaTi} - 2)`}
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
    setTVar(dd1k.t_i);
    setNOfTVar(dd1k.computeNOfT(dd1k.t_i));
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
      <div className="space-y-6 text-sm md:text-base">
        {/* Main header with title */}
        <Box
          className="text-center mb-6"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 2, md: 4 },
          }}
        >
          <Typography
            variant="h1"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <strong>Note:</strong>
            <MathJax inline>{`\\(${caseOutput}\\)`}</MathJax>
          </div>
          <div className="flex items-center gap-2">
            <strong>Arrival Rate: </strong>
            <MathJax
              inline
            >{`\\(\\lambda = ${formatFraction(arrivalRateFraction)}\\)`}</MathJax>
          </div>
          <div className="flex items-center gap-2">
            <strong>Service Rate: </strong>
            <MathJax
              inline
            >{`\\(\\mu = ${formatFraction(serviceRateFraction)}\\)`}</MathJax>
          </div>
          <div className="flex items-center gap-2">
            <strong>Capacity: </strong>
            <MathJax inline>{`\\(K = ${capacity}\\)`}</MathJax>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <strong>Time of First Balk:</strong>
            <MathJax inline>{`\\(t_i = ${t_i}\\)`}</MathJax>
          </div>
        </div>

        <Divider />

        {/* Section for displaying n(t) */}
        <div className="space-y-8">
          <strong>
            Number of Customers: <MathJax inline>{`\\(n(t)\\)`}</MathJax>
          </strong>
          <div className="ml-4 space-y-8">
            {/* n(t): t < 1/λ */}
            <div>
              <MathJax>{`\\( \\text{For }t < \\frac{1}{\\lambda}:\\)`}</MathJax>
              <div className="ml-6 mt-4">
                <MathJax
                  inline
                >{`\\(n(t) = ${n_t.t_lessThan_arrivalTime}\\)`}</MathJax>
              </div>
            </div>

            {/* n(t): 1/λ ≤ t < t_i */}
            <div>
              <MathJax>{`\\( \\text{For } 1/\\lambda \\leq t < t_i:\\)`}</MathJax>
              <div className="ml-6 mt-4">
                <MathJax>{`\\(n(t) = ${n_t.t_between_arrivalTime_and_ti}\\)`}</MathJax>
              </div>
            </div>

            {/* n(t): t ≥ t_i */}
            <div>
              <MathJax>{`\\( \\text{For }t \\geq t_i:\\)`}</MathJax>
              <div className="ml-6 mt-4">
                <MathJax>{`\\(n(t) ${n_t.t_greaterOrEqual_ti}\\)`}</MathJax>
              </div>
            </div>
          </div>

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
        </div>

        <Divider />

        {/* Section for displaying Wq(n) */}
        <div className="space-y-4">
          <strong>
            Waiting Times: <MathJax inline>{`\\(Wq(n)\\)`}</MathJax>
          </strong>
          <div className="ml-4 space-y-8">
            {/* Wq(n): n = 0 */}
            <div>
              <MathJax>{`\\( \\text{For }n = 0:\\)`}</MathJax>
              <div className="ml-6 mt-4">
                <MathJax inline>{`\\(Wq(n) = ${wqOfN.n0}\\)`}</MathJax>
              </div>
            </div>

            {/* Wq(n): n < λt_i */}
            <div>
              <MathJax>{`\\( \\text{For }n < \\lambda t_i:\\)`}</MathJax>
              <div className="ml-6 mt-4">
                <MathJax>{`\\(Wq(n) = ${wqOfN.n_LessThan_LambdaTi}\\)`}</MathJax>
              </div>
            </div>

            {/* Wq(n): n ≥ λt_i */}
            <div>
              <MathJax>{`\\( \\text{For }n \\geq \\lambda t_i:\\)`}</MathJax>
              <div className="ml-6 mt-4 mb-4">
                {wqOfN.nGreaterThanOrEqualLambdaTi}
              </div>
            </div>
          </div>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              pt: 2,
              pb:3,
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
        </div>
      </div>
    </MathJaxContext>
  );
};

export default Dd1kLambdaExceedNewResults;
