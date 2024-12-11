import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import DD1K from "@/class/dd1k/DD1K";

type Dd1kλEqualμResultsProps = {
  dd1k: DD1K;
};

const Dd1kλEqualμResults: React.FC<Dd1kλEqualμResultsProps> = ({ dd1k }) => {
  const { capacity, serviceRate, serviceRateFraction } = dd1k;

  useEffect(() => {
    // eslint-disable-next-line
    window.MathJax && window.MathJax.typeset();
  }, [dd1k]);

  const M = capacity;
  const Wq_n = (M - 1) * (1 / serviceRate);

  return (
    <MathJaxContext>
      <div className="space-y-6 text-sm md:text-base">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <div className="space-y-8">
          <h3 className="text-lg md:text-xl font-semibold">
            <MathJax inline>{`\\(n(t)\\)`}</MathJax> (Number of Customers)
          </h3>
          <div className="ml-4 space-y-8">
            <div>
              <MathJax>{`\\( \\text{For all } t:\\)`}</MathJax>
              <div className="ml-6 mt-4">
                <MathJax inline>{`\\(n(t) = ${M}\\)`}</MathJax>
              </div>
            </div>
          </div>

          <Divider />

          <h3 className="text-lg md:text-xl font-semibold">
            <MathJax inline>{`\\(Wq(n)\\)`}</MathJax> (Waiting Times)
          </h3>
          <div className="ml-4 space-y-8">
            <div>
              <MathJax>{`\\( \\text{For all } n:\\)`}</MathJax>
              <div className="ml-6 mt-4">
                <MathJax
                  inline
                >{`\\(Wq(n) = (${M} - 1) \\cdot \\frac{1}{\\mu} = ${Wq_n}\\)`}</MathJax>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
};

export default Dd1kλEqualμResults;
