import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NoNumberArrowsTextField } from "@/components/base/NoNumberArrowsTextField";
import DD1K from "@/class/dd1k/DD1K";

type Dd1kLambdaExceedNewlResultsProps = {
  dd1k: DD1K;
};

const Dd1kLambdaExceedNewlResults: React.FC<Dd1kLambdaExceedNewlResultsProps> = ({
  dd1k,
}) => {
  const {
    capacity,
    serviceRate,
    arrivalRateFraction,
    serviceRateFraction,
    t_i,
  } = dd1k;

  useEffect(() => {
    // eslint-disable-next-line
    window.MathJax && window.MathJax.typeset();
  }, [dd1k]);

  const M = capacity;
  const initialWq = (M - 1) / (2 * serviceRate);

  const isWholeNumber = (fraction: {
    numerator: number;
    denominator: number;
  }) => {
    return fraction.denominator === 1;
  };

  const isServiceRateWhole = isWholeNumber(serviceRateFraction);
  const isArrivalRateWhole = isWholeNumber(arrivalRateFraction);

  const [tVar, setTVar] = useState<number | undefined>();
  const [nOfTVar, setNOfTVar] = useState<number>(0);
  const [nVar, setNVar] = useState<number | undefined>();
  const [wqOfNVar, setWqOfNVar] = useState<number | undefined>();

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

  const formatFraction = (fraction: {
    numerator: number;
    denominator: number;
  }) => {
    if (fraction.denominator === 1) {
      return fraction.numerator.toString();
    }
    return `\\frac{${fraction.numerator}}{${fraction.denominator}}`;
  };

  return (
    <MathJaxContext>
      <div className="space-y-6 text-sm md:text-base">
        <Box
          className="text-center mb-6"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
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
            <strong>Arrival Rate (λ):</strong>
            <MathJax
              inline
            >{`\\(\\lambda = ${formatFraction(arrivalRateFraction)}\\)`}</MathJax>
          </div>
          <div className="flex items-center gap-2">
            <strong>Service Rate (μ):</strong>
            <MathJax
              inline
            >{`\\(\\mu = ${formatFraction(serviceRateFraction)}\\)`}</MathJax>
          </div>
          <div className="flex items-center gap-2">
            <strong>System Capacity (K):</strong>
            <MathJax inline>{`\\(K = ${capacity}\\)`}</MathJax>
          </div>
        </div>

        <Divider />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <strong>
              <MathJax inline>{`\\(t_i\\)`}</MathJax> (Time of First Balk):
            </strong>
            <MathJax inline>{`\\(t_i = ${t_i}\\)`}</MathJax>
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
                <MathJax
                  inline
                >{`\\(n(t) = M + \\lfloor \\lambda t \\rfloor - \\lfloor \\mu t \\rfloor\\)`}</MathJax>
              </div>
              <div className="ml-6 mt-4">
                <MathJax
                  inline
                >{`\\(n(t) = ${M} + \\lfloor ${formatFraction(arrivalRateFraction)}t \\rfloor - \\lfloor ${formatFraction(serviceRateFraction)}t \\rfloor\\)`}</MathJax>
              </div>
              {tVar !== undefined && (
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    marginTop: "1rem",
                  }}
                >
                  Actual value of n(t) = {nOfTVar}
                </Typography>
              )}
            </div>
          </div>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                minWidth: "8rem",
              }}
            >
              n(t) for t =
            </Typography>
            <NoNumberArrowsTextField
              label="t ="
              placeholder="t = "
              value={tVar}
              type="number"
              variant="outlined"
              onChange={handleTVarChange}
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography
                      sx={{
                        minWidth: "6rem",
                        borderLeft: "1px solid #000",
                        paddingLeft: "1rem",
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

        <div className="space-y-8">
          <h3 className="text-lg md:text-xl font-semibold">
            <MathJax inline>{`\\(Wq(n)\\)`}</MathJax> (Waiting Times)
          </h3>
          <div className="ml-4 space-y-8">
            <div>
              <MathJax>{`\\( \\text{Initial Average Waiting Time for M Customers:}\\)`}</MathJax>
              <div className="ml-6 mt-4">
                <MathJax
                  inline
                >{`\\(W_q(0) = \\frac{M - 1}{2\\mu} = ${initialWq}\\)`}</MathJax>
              </div>
            </div>

            <div>
              <MathJax>{`\\( \\text{For } n < \\lfloor \\lambda t_i \\rfloor:\\)`}</MathJax>
              <div className="ml-6 mt-4">
                <MathJax
                  inline
                >{`\\(Wq(n) = (M - 1 + n) \\cdot \\frac{1}{\\mu} - n \\cdot \\frac{1}{\\lambda}\\)`}</MathJax>
              </div>
              <div className="ml-6 mt-4">
                <MathJax inline>{`\\(Wq(n) = (n + ${M - 1}) \\cdot ${
                  isServiceRateWhole
                    ? `\\frac{1}{${serviceRateFraction.numerator}}`
                    : `\\frac{${serviceRateFraction.denominator}}{${serviceRateFraction.numerator}}`
                } - n \\cdot ${
                  isArrivalRateWhole
                    ? `\\frac{1}{${arrivalRateFraction.numerator}}`
                    : `\\frac{${arrivalRateFraction.denominator}}{${arrivalRateFraction.numerator}}`
                }\\)`}</MathJax>
              </div>
              {nVar !== undefined && (
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    marginTop: "1rem",
                  }}
                >
                  Actual value of Wq(n) = {wqOfNVar}
                </Typography>
              )}
            </div>

            <div>
              <MathJax>{`\\( \\text{For } n \\geq \\lfloor \\lambda t_i \\rfloor:\\)`}</MathJax>
              <div className="ml-6 mt-4">
                <MathJax inline>{`\\(Wq(n) = 0\\)`}</MathJax>
              </div>
            </div>
          </div>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                minWidth: "8rem",
              }}
            >
              Wq(n) for n =
            </Typography>
            <NoNumberArrowsTextField
              label="n ="
              placeholder="n = "
              value={nVar}
              type="number"
              variant="outlined"
              onChange={handleNVarChange}
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography
                      sx={{
                        minWidth: "12rem",
                        borderLeft: "1px solid #000",
                        paddingLeft: "1rem",
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

export default Dd1kLambdaExceedNewlResults;
