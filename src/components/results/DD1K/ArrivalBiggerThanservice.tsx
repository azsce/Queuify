import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Box, Divider, Typography } from "@mui/material";
import { DD1KCharacteristics, N_Of_T } from "@/types/dd1k";

import { DD1KλExceedμ } from "@/lib/dd1k";
import { NoNumberArrowsTextField } from "../../NoNumberArrowsTextField";
import { useEffect, useState } from "react";

type Wq_Of_N = {
  n0: string; // n = 0
  n_LessThan_LambdaTi: string; // n < λ*t_i
  nGreaterThanOrEqualLambdaTi: string; // n ≥ λ*t_i
};

const ArrivalBiggerThanservice: React.FC<DD1KCharacteristics> = ({
  type,
  capacity,
  arrivalRate,
  serviceRate,
  arrivalRateFraction,
  serviceRateFraction,
  t_i,
}) => {
  useEffect(() => {
    // eslint-disable-next-line
    window.MathJax && window.MathJax.typeset();
  }, [
    type,
    capacity,
    arrivalRate,
    serviceRate,
    arrivalRateFraction,
    serviceRateFraction,
    t_i,
  ]);

  const kMinus1 = capacity - 1;
  const kMinus2 = capacity - 2;

  let t_greaterOrEqual_ti = "";
  if (type === "λ > μ") {
    t_greaterOrEqual_ti = `\\text{ alternates between } ${kMinus1} \\text{ and } ${kMinus2}`;
  } else if (type === "(λ > μ) && λ%μ = 0") {
    t_greaterOrEqual_ti = `\\text{ = } ${kMinus1}`;
  }

  const n_t: N_Of_T = {
    t_lessThan_arrivalTime: `0`,
    t_between_arrivalTime_and_ti: `⌊t/${arrivalRateFraction.denominator}⌋ - ⌊t/${serviceRateFraction.denominator} - ${arrivalRateFraction.denominator}/${serviceRateFraction.denominator}⌋`,
    t_greaterOrEqual_ti: t_greaterOrEqual_ti,
  };

  const service_minus_arrival_time =
    serviceRateFraction.denominator - arrivalRateFraction.denominator;

  let nGreaterThanOrEqualLambdaTi = "";
  if (type === "λ > μ") {
    nGreaterThanOrEqualLambdaTi = `\\text{ alternates between } ${service_minus_arrival_time}(\\lambda t_i - 2) \\text{ and } ${service_minus_arrival_time}(\\lambda t_i - 3)`;
  } else if (type === "(λ > μ) && λ%μ = 0") {
    nGreaterThanOrEqualLambdaTi = `\\text{ = } ${service_minus_arrival_time}(\\lambda t_i - 2)`;
  }

  const wqOfN: Wq_Of_N = {
    n0: "0",
    n_LessThan_LambdaTi: `${service_minus_arrival_time}(n - 1)`,
    nGreaterThanOrEqualLambdaTi: nGreaterThanOrEqualLambdaTi,
  };

  let caseOutput = "";
  if (type === "λ > μ") {
    caseOutput = "\\lambda > \\mu";
  } else if (type === "(λ > μ) && λ%μ = 0") {
    caseOutput = "(\\lambda > \\mu) \\text{ and } (\\lambda \\% \\mu = 0)";
  }

  const [tVar, setTVar] = useState<number | undefined>(0);
  const [nOfTVar, setNOfTVar] = useState<number>(0);
  const [nVar, setNVar] = useState<number | undefined>(0);
  const [wqOfNVar, setWqOfNVar] = useState<number | undefined>(0);

  const handleTVarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    setTVar(t);
    const nOfT = DD1KλExceedμ.computeNOfT(
      t,
      arrivalRate,
      serviceRate,
      t_i,
      capacity,
      type
    );
    console.log(nOfT);
    setNOfTVar(nOfT);
  };

  const handleNVarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseFloat(e.target.value);
    setNVar(n);
    const wqOfN = DD1KλExceedμ.computeWqOfN(
      n,
      arrivalRate,
      serviceRate,
      t_i,
      type
    );
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
            <strong>Arrival Rate (λ):</strong>
            <MathJax
              inline
            >{`\\(\\lambda = ${arrivalRateFraction.numerator}/${arrivalRateFraction.denominator}\\)`}</MathJax>
          </div>
          <div className="flex items-center gap-2">
            <strong>Service Rate (μ):</strong>
            <MathJax
              inline
            >{`\\(\\mu = ${serviceRateFraction.numerator}/${serviceRateFraction.denominator}\\)`}</MathJax>
          </div>
          <div className="flex items-center gap-2">
            <strong>System Capacity (K):</strong>
            <MathJax inline>{`\\(K = ${capacity}\\)`}</MathJax>
          </div>
        </div>

        <Divider />

        {/* Section for displaying t_i and case */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <strong>
              <MathJax inline>{`\\(t_i\\)`}</MathJax> (Time of First Balk):
            </strong>
            <MathJax inline>{`\\(t_i = ${t_i}\\)`}</MathJax>
          </div>

          <div className="flex items-center gap-2">
            <strong>Case:</strong>
            <MathJax inline>{`\\(${caseOutput}\\)`}</MathJax>
          </div>
        </div>

        <Divider />

        {/* Section for displaying n(t) */}
        <div className="space-y-8">
          <h3 className="text-lg md:text-xl font-semibold">
            <MathJax inline>{`\\(n(t)\\)`}</MathJax> (Number of Customers)
          </h3>
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
              flexDirection: { xs: "column", md: "row" },
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <Typography variant="h6">n(t) for t = ...</Typography>
            <NoNumberArrowsTextField
              label="t ="
              placeholder="t = "
              value={tVar}
              type="number"
              variant="outlined"
              onChange={handleTVarChange}
              sx={{ width: { xs: "100%", md: "auto" } }}
              color="primary"
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography
                      sx={{
                        minWidth: { xs: "8rem", sm: "16rem" },
                        borderLeft: "1px solid",
                        borderColor: "primary.main",
                        paddingLeft: "1rem",
                        color: "primary.main",
                      }}
                    >
                      n(t) = {nOfTVar}
                    </Typography>
                  ),
                },
              }}
            ></NoNumberArrowsTextField>
          </Box>
        </div>

        <Divider />

        {/* Section for displaying Wq(n) */}
        <div className="space-y-8" style={{ marginBottom: 20 }}>
          <h3 className="text-lg md:text-xl font-semibold">
            <MathJax inline>{`\\(Wq(n)\\)`}</MathJax> (Waiting Times)
          </h3>
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
                <MathJax
                  inline
                >{`\\(Wq(n) ${wqOfN.nGreaterThanOrEqualLambdaTi}\\)`}</MathJax>
              </div>
            </div>
          </div>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <Typography variant="h6">Wq(n) for n = ....</Typography>
            <NoNumberArrowsTextField
              label="n ="
              placeholder="n = "
              value={nVar}
              type="number"
              variant="outlined"
              onChange={handleNVarChange}
              sx={{ width: { xs: "100%", md: "auto" } }}
              color="secondary"
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography
                      sx={{
                        minWidth: { xs: "8rem", sm: "16rem" },
                        borderLeft: "1px solid",
                        borderColor: "secondary.main",
                        paddingLeft: "0.5rem",
                        color: "secondary.main",
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

export default ArrivalBiggerThanservice;
