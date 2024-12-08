import React, { useEffect } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Divider } from "@mui/material";
import DD1KGraphContainer from "../graphs/dd1k/DD1KGraphContainer";
import { DD1KCharacteristics, N_Of_T } from "@/types/dd1k";

declare global {
  interface Window {
    MathJax?: {
      typeset: () => void;
    };
  }
}

type DD1KResultsProps = {
  characteristics: DD1KCharacteristics;
};

const DD1KResults: React.FC<DD1KResultsProps> = ({ characteristics }) => {
  useEffect(() => {
    // eslint-disable-next-line
    window.MathJax && window.MathJax.typeset();
  }, [characteristics]);

  return <ArrivalBiggerThanservice {...characteristics} />;
};

const ArrivalBiggerThanservice: React.FC<DD1KCharacteristics> = ({
  type,
  capacity,
  arrivalRateFraction,
  serviceRateFraction,
  t_i,
}) => {
  let t_greaterOrEqual_ti = "";
  if (type === "λ > μ") {
    t_greaterOrEqual_ti = "\\text{ alternates between } k-1 \\text{ and } k-2";
  } else if (type === "(λ > μ) && λ%μ = 0") {
    t_greaterOrEqual_ti = "\\text{ = } k-1";
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

  return (
    <MathJaxContext>
      <div className="space-y-6 text-sm md:text-base">
        {/* Main header with title */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">
            <MathJax inline>{`\\(D/D/1/(k-1)\\)`}</MathJax> Queue Results
          </h2>
        </div>

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
            <MathJax inline>{`\\(t_i = ${t_i.toFixed(2)}\\)`}</MathJax>
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
        </div>

        <Divider />

        {/* Section for displaying Wq(n) */}
        <div className="space-y-8">
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
              <div className="ml-6 mt-4">
                <MathJax
                  inline
                >{`\\(Wq(n) ${wqOfN.nGreaterThanOrEqualLambdaTi}\\)`}</MathJax>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
};

type Wq_Of_N = {
  n0: string; // n = 0
  n_LessThan_LambdaTi: string; // n < λ*t_i
  nGreaterThanOrEqualLambdaTi: string; // n ≥ λ*t_i
};

export default DD1KResults;
