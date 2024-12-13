import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import Dd1k from "@/class/dd1k/Dd1k";
import { formatFraction, roundTo4Decimals, toProperFraction } from "@/lib/math";

type Dd1kLambdaEqualNewResultsProps = {
  dd1k: Dd1k;
};

const Dd1kLambdaEqualNewResults: React.FC<Dd1kLambdaEqualNewResultsProps> = ({
  dd1k,
}) => {
  const {
    capacity,
    serviceRate,
    serviceRateFraction,
    arrivalRateFraction,
    initialCustomers,
  } = dd1k;

  useEffect(() => {
    // eslint-disable-next-line
    window.MathJax && window.MathJax.typeset();
  }, [dd1k]);

  const wqOfn = (initialCustomers - 1) * (1 / serviceRate);
  const wqOfNFraction = toProperFraction(wqOfn);

  return (
    <MathJaxContext>
      <div className="space-y-6 text-sm md:text-base mb-4">
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
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <strong>Initial Customers: :</strong>
              <MathJax inline>{`\\(M = ${initialCustomers}\\)`}</MathJax>
            </div>
          </div>
        </div>

        <Divider />

        <div className="space-y-4">
          <strong>
            Number of Customers: <MathJax inline>{`\\(n(t)\\)`}</MathJax>
          </strong>
          <div className="ml-4 space-y-8">
            <div>
              <MathJax>{`\\( \\text{For all } t:\\)`}</MathJax>
              <div className="ml-6 mt-4">
                <MathJax inline>{`\\(n(t) = ${initialCustomers}\\)`}</MathJax>
              </div>
            </div>
          </div>

          <Divider />

          <div className="space-y-4">
            <strong>
              Waiting Times: <MathJax inline>{`\\(Wq(n)\\)`}</MathJax>
            </strong>
            <div className="ml-4 space-y-8">
              <div>
                <MathJax>{`\\( \\text{For all } n:\\)`}</MathJax>
                <div className="ml-6 mt-4">
                  <MathJax
                    inline
                  >{`\\(Wq(n) = (${initialCustomers} - 1) \\cdot \\frac{1}{\\mu} = ${
                    formatFraction(wqOfNFraction) +
                    " = " +
                    roundTo4Decimals(wqOfn)
                  }\\)`}</MathJax>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
};

export default Dd1kLambdaEqualNewResults;
