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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, md: 4 },
          mb: 2,
          mx: { xs: 1, sm: 0 },
        }}
      >
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

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">Note:</Typography>
            <MathJax inline>{`\\( \\lambda < \\mu \\)`}</MathJax>
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">Initial Customers: :</Typography>
              <MathJax inline>{`\\(M = ${initialCustomers}\\)`}</MathJax>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">Transient time:</Typography>
              <MathJax inline>{`\\(t_i = ${t_i}\\)`}</MathJax>
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="body1">
            Number of Customers: <MathJax inline>{`\\(n(t)\\)`}</MathJax>
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, ml: 4 }}>
            <MathJax>{`\\( \\text{For all } t:\\)`}</MathJax>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 4 }}>
              <MathJax
                inline
              >{`\\(n(t) = M + \\lfloor \\lambda t \\rfloor - \\lfloor \\mu t \\rfloor\\)`}</MathJax>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 4 }}>
              <MathJax inline>{`\\(n(t) = ${initialCustomers} + \\lfloor ${
                arrivalRate === 1
                  ? ""
                  : formatFraction(arrivalRateFraction) + "\\cdot"
              } t \\rfloor - \\lfloor ${
                serviceRate === 1
                  ? ""
                  : formatFraction(serviceRateFraction) + "\\cdot"
              } t \\rfloor\\)`}</MathJax>
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1">
            Waiting Time: <MathJax inline>{`\\(Wq(n)\\)`}</MathJax>
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, ml: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body1">
                Average Waiting Time for initial Customers:
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, ml: 4 }}
              >
                {isDecimalZeroAfterRounding(initialWq) ? (
                  <MathJax
                    inline
                  >{`\\(W_q(0) = \\frac{M - 1}{2\\mu} = ${roundTo4Decimals(initialWq)}\\)`}</MathJax>
                ) : (
                  <MathJax
                    inline
                  >{`\\(W_q(0) = \\frac{M - 1}{2\\mu} = ${formatFraction(initialWqFraction)}\\) = ${roundTo4Decimals(initialWq)}`}</MathJax>
                )}
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MathJax>{`\\( \\text{For } n < \\lfloor \\lambda t_i \\rfloor:\\)`}</MathJax>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, ml: 4 }}
              >
                <MathJax
                  inline
                >{`\\(Wq(n) = (M - 1 + n) \\cdot \\frac{1}{\\mu} - n \\cdot \\frac{1}{\\lambda}\\)`}</MathJax>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, ml: 4 }}
              >
                <MathJax inline>{`\\(Wq(n) = (n + ${initialCustomers - 1})  ${
                  serviceRate === 1
                    ? ""
                    : "\\cdot" + formatFraction(serviceRateFraction)
                } - ${
                  arrivalRate === 1
                    ? ""
                    : formatFraction(arrivalRateFraction) + "\\cdot"
                } n  \\)`}</MathJax>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MathJax>{`\\( \\text{For } n \\geq \\lfloor \\lambda t_i \\rfloor:\\)`}</MathJax>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, ml: 4 }}
              >
                <MathJax inline>{`\\(Wq(n) = 0\\)`}</MathJax>
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
        </Box>
      </Box>
    </MathJaxContext>
  );
};

export default Dd1kNewExceedLambdaResults;
