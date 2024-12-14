import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NoNumberArrowsTextField } from "@/components/base/NoNumberArrowsTextField";
import Dd1k from "@/class/dd1k/Dd1k";
import {
  formatFraction,
  toProperFraction,
  isDecimalZeroAfterRounding,
  roundTo4Decimals,
} from "@/lib/math";

type Dd1kLambdaExceedNewlResultsProps = {
  dd1k: Dd1k;
};

const Dd1kNewExceedLambdaResults: React.FC<
  Dd1kLambdaExceedNewlResultsProps
> = ({ dd1k }) => {
  const {
    capacity,
    serviceRate,
    arrivalRate,
    arrivalRateFraction,
    serviceRateFraction,
    timeSpecialValue: t_i,
    initialCustomers,
  } = dd1k;

  useEffect(() => {
    // eslint-disable-next-line
    window.MathJax && window.MathJax.typeset();
  }, [dd1k]);

  const initialWq = (initialCustomers - 1) / (2 * serviceRate);
  const initialWqFraction = toProperFraction(initialWq);

  const [tVar, setTVar] = useState<number | undefined>(dd1k.transientTime);
  const [nOfTVar, setNOfTVar] = useState<number>(0);
  const [nVar, setNVar] = useState<number | undefined>(dd1k.lambdaTiFloored);
  const [wqOfNVar, setWqOfNVar] = useState<number | undefined>(
    dd1k.waitingTimeForNthCustomer(dd1k.lambdaTiFloored)
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
      <div className="space-y-6 text-sm md:text-base mb-4">
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
            <strong>Note:</strong>
            <MathJax inline>{`\\( \\lambda < \\mu \\)`}</MathJax>
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
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <strong>Initial Customers: :</strong>
              <MathJax inline>{`\\(M = ${initialCustomers}\\)`}</MathJax>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <strong>Transient time:</strong>
              <MathJax inline>{`\\(t_i = ${t_i}\\)`}</MathJax>
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
                <MathJax
                  inline
                >{`\\(n(t) = M + \\lfloor \\lambda t \\rfloor - \\lfloor \\mu t \\rfloor\\)`}</MathJax>
              </div>
              <div className="ml-6 mt-4">
                <MathJax inline>{`\\(n(t) = ${initialCustomers} + \\lfloor ${
                  arrivalRate === 1
                    ? ""
                    : formatFraction(arrivalRateFraction) + "\\cdot"
                } t \\rfloor - \\lfloor ${
                  serviceRate === 1
                    ? ""
                    : formatFraction(serviceRateFraction) + "\\cdot"
                } t \\rfloor\\)`}</MathJax>
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
              pt:2
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

        <div className="space-y-4">
          <strong>
            Waiting Times: <MathJax inline>{`\\(Wq(n)\\)`}</MathJax>
          </strong>
          <div className="ml-4 space-y-8">
            <div>
              <Typography variant="body1">
                Average Waiting Time for initial Customers:
              </Typography>
              <div className="ml-6 mt-4">
                {isDecimalZeroAfterRounding(initialWq) ? (
                  <MathJax
                    inline
                  >{`\\(W_q(0) = \\frac{M - 1}{2\\mu} = ${roundTo4Decimals(initialWq)}\\)`}</MathJax>
                ) : (
                  <MathJax
                    inline
                  >{`\\(W_q(0) = \\frac{M - 1}{2\\mu} = ${formatFraction(initialWqFraction)}\\) = ${roundTo4Decimals(initialWq)}`}</MathJax>
                )}
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
                <MathJax inline>{`\\(Wq(n) = (n + ${initialCustomers - 1})  ${
                  serviceRate === 1
                    ? ""
                    : "\\cdot" + formatFraction(serviceRateFraction)
                } - ${
                  arrivalRate === 1
                    ? ""
                    : formatFraction(arrivalRateFraction) + "\\cdot"
                } n  \\)`}</MathJax>
              </div>
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
              gap: 2,
              pt: 2,
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
                      = {wqOfNVar}
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

export default Dd1kNewExceedLambdaResults;
