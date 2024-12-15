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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">Note:</Typography>
            <MathJax inline>{`\\( \\lambda = \\mu \\)`}</MathJax>
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
            <Typography variant="body1">Initial Customers: :</Typography>
            <MathJax inline>{`\\(M = ${initialCustomers}\\)`}</MathJax>
          </Box>
          {/* </div> */}
        </Box>

        <Divider />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="subtitle1">
            Number of Customers: <MathJax inline>{`\\(n(t)\\)`}</MathJax>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 4, ml: 4 }}>
            <Box>
              <MathJax>{`\\( \\text{For all } t:\\)`}</MathJax>
              <Box sx={{ ml: 4 }}>
                <MathJax inline>{`\\(n(t) = ${initialCustomers}\\)`}</MathJax>
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
            <Typography variant="subtitle1">
              Waiting Times: <MathJax inline>{`\\(Wq(n)\\)`}</MathJax>
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                ml: 4,
              }}
            >
              <Box>
                <MathJax>{`\\( \\text{For all } n:\\)`}</MathJax>
                <Box sx={{ ml: 6 }}>
                  <MathJax
                    inline
                  >{`\\(Wq(n) = (${initialCustomers} - 1) \\cdot \\frac{1}{\\mu} = ${
                    formatFraction(wqOfNFraction) +
                    " = " +
                    roundTo4Decimals(wqOfn)
                  }\\)`}</MathJax>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </MathJaxContext>
  );
};

export default Dd1kLambdaEqualNewResults;
