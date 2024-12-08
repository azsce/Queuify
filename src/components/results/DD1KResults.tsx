import React, { useEffect } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Separator } from "@/components/ui/separator";
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
    // sonarlint-disable-next-line
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

  let nGreaterThanOrEqualLambdaTi = "";
  if (type === "λ > μ") {
    nGreaterThanOrEqualLambdaTi = `\\text{ alternates between } (1/${serviceRateFraction.denominator} - 1/${arrivalRateFraction.denominator})(\\lambda t_i - 2) \\text{ and } (1/${serviceRateFraction.denominator} - 1/${arrivalRateFraction.denominator})(\\lambda t_i - 3)`;
  } else if (type === "(λ > μ) && λ%μ = 0") {
    nGreaterThanOrEqualLambdaTi = `\\text{ = } (1/${serviceRateFraction.denominator} - 1/${arrivalRateFraction.denominator})(\\lambda t_i - 2)`;
  }

  const wqOfN: Wq_Of_N = {
    n0: "0",
    n_LessThan_LambdaTi: `(1/${serviceRateFraction.denominator} - 1/${arrivalRateFraction.denominator})(n - 1)`,
    nGreaterThanOrEqualLambdaTi: nGreaterThanOrEqualLambdaTi,
  };
  

  let caseOutput = "";
  if (type === "λ > μ") {
    caseOutput = '\\lambda > \\mu';
  }
  else if (type === "(λ > μ) && λ%μ = 0") {
    caseOutput = '(\\lambda > \\mu) \\text{ and } \\lambda \\bmod \\mu = 0';
  }

  return (
    <MathJaxContext>
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            <MathJax inline>{`\\(D/D/1/(k-1)\\)`}</MathJax> Queue Results
          </h2>
        </div>

        <div className="space-y-4">
          <p className="flex items-center gap-2">
            <strong>
              <MathJax inline>{`\\(t_i\\)`}</MathJax> (Time of First Balk):
            </strong>
            <MathJax inline>{`\\(t_i = ${t_i.toFixed(2)}\\)`}</MathJax>
          </p>

          <p className="flex items-center gap-2">
            <strong>Case:</strong>
            <MathJax inline>{`\\(${caseOutput}\\)`}</MathJax>
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            <MathJax inline>{`\\(n(t)\\)`}</MathJax> (Number of Customers)
          </h3>
          <div className="ml-4 space-y-3">
            <p>
              <MathJax>{`\\( \\text{For }t < \\frac{1}{\\lambda}:\\)`}</MathJax>
              <span className="ml-2">
                <MathJax
                  inline
                >{`\\(n(t) = ${n_t.t_lessThan_arrivalTime}\\)`}</MathJax>
              </span>
            </p>
            <p>
              <MathJax>{`\\( \\text{For }\\frac{1}{\\lambda} \\leq t < t_i:\\)`}</MathJax>
              <div className="ml-2 mt-1">
                <MathJax>{`\\(n(t) = ${n_t.t_between_arrivalTime_and_ti}\\)`}</MathJax>
              </div>
            </p>
            <p>
              <MathJax>{`\\( \\text{For }t \\geq t_i:\\)`}</MathJax>
              <div className="ml-2 mt-1">
                <MathJax>{`\\(n(t) ${n_t.t_greaterOrEqual_ti}\\)`}</MathJax>
              </div>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            <MathJax inline>{`\\(Wq(n)\\)`}</MathJax> (Waiting Times)
          </h3>
          <div className="ml-4 space-y-3">
            <p>
              <MathJax>{`\\( \\text{For }n = 0:\\)`}</MathJax>
              <span className="ml-2">
                <MathJax inline>{`\\(Wq(n) = ${wqOfN.n0}\\)`}</MathJax>
              </span>
            </p>
            <p>
              <MathJax>{`\\( \\text{For }n < \\lambda t_i:\\)`}</MathJax>
              <div className="ml-2 mt-1">
                <MathJax>{`\\(Wq(n) = ${wqOfN.n_LessThan_LambdaTi}\\)`}</MathJax>
              </div>
            </p>
            <p>
              <MathJax>{`\\( \\text{For }n \\geq \\lambda t_i:\\)`}</MathJax>
              <span className="ml-2">
                <MathJax
                  inline
                >{`\\(Wq(n) ${wqOfN.nGreaterThanOrEqualLambdaTi}\\)`}</MathJax>
              </span>
            </p>
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
