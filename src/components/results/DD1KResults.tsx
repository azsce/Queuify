import React, { useEffect } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Separator } from "@/components/ui/separator";
import DD1KGraphContainer from "../graphs/dd1k/DD1KGraphContainer";

const DD1KResults = ({ results }) => {
  useEffect(() => {
    window.MathJax && window.MathJax.typeset();
  }, [results]);

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
            <MathJax inline>{`\\(t_i = ${results.t1.toFixed(2)}\\)`}</MathJax>
          </p>
          <p className="flex items-center gap-2">
            <strong>Blocking Probability:</strong>{" "}
            {results.blockingProbability?.toFixed(2)}
          </p>
          <p className="flex items-center gap-2">
            <strong>Case:</strong>{" "}
            <MathJax inline>{`\\(\\lambda > \\mu\\)`}</MathJax>
          </p>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            <MathJax inline>{`\\(n(t)\\)`}</MathJax> (Number of Customers)
          </h3>
          <div className="ml-4 space-y-3">
            <p>
              <MathJax>{`\\( \\text{For }t < \\frac{1}{\\lambda}:\\)`}</MathJax>
              <span className="ml-2">
                <MathJax inline>{`\\(n(t) = 0\\)`}</MathJax>
              </span>
            </p>
            <p>
              <MathJax>{`\\( \\text{For }\\frac{1}{\\lambda} \\leq t < t_i:\\)`}</MathJax>
              <div className="ml-2 mt-1">
                <MathJax>{`\\(n(t) = \\left\\lfloor \\frac{t}{4} \\right\\rfloor - \\left\\lfloor \\frac{t}{6} - \\frac{4}{6} \\right\\rfloor \\)`}</MathJax>
              </div>
            </p>
            <p>
              <MathJax>{`\\( \\text{For }t \\geq t_i:\\)`}</MathJax>
              <div className="ml-2 mt-1">
                <MathJax>{`\\(n(t) = \\left\\lfloor \\frac{t}{4} \\right\\rfloor - \\left\\lfloor \\frac{t}{6} - \\frac{4}{6} \\right\\rfloor \\)`}</MathJax>
              </div>
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            <MathJax inline>{`\\(Wq(n)\\)`}</MathJax> (Waiting Times)
          </h3>
          <div className="ml-4 space-y-3">
            <p>
              <MathJax>{`\\( \\text{For }n = 0:\\)`}</MathJax>
              <span className="ml-2">
                <MathJax inline>{`\\(Wq(n) = 0\\)`}</MathJax>
              </span>
            </p>
            <p>
              <MathJax>{`\\( \\text{For }n < \\lambda t_i:\\)`}</MathJax>
              <div className="ml-2 mt-1">
                <MathJax>{`\\(Wq(n) = \\left( \\frac{1}{\\frac{1}{6}} - \\frac{1}{\\frac{1}{4}} \\right) * (n - 1) \\)`}</MathJax>
              </div>
            </p>
            <p>
              <MathJax>{`\\( \\text{For }n \\geq \\lambda t_i:\\)`}</MathJax>
              <span className="ml-2">
                <MathJax inline>{`\\(Wq(n) = 0\\)`}</MathJax>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <DD1KGraphContainer
          arrivalRate={results.arrivalRate}
          serviceRate={results.serviceRate}
          capacity={results.capacity}
        />
      </div>
    </MathJaxContext>
  );
};

export default DD1KResults;
