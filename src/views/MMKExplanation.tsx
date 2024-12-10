"use client";

import { MathJax, MathJaxContext } from "better-react-mathjax";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import { useEffect } from "react";

const MMExplanation = () => {
  useEffect(() => {
    // eslint-disable-next-line
    window.MathJax && window.MathJax.typeset();
  }, []);

  return (
    <Container
      // maxWidth="lg"
      sx={(theme) => ({
        py: 4,
        maxWidth: "100%",
        [theme.breakpoints.up("xs")]: {
          maxWidth: "100%",
        },
        [theme.breakpoints.up("sm")]: {
          maxWidth: theme.breakpoints.values.lg,
        },
        [theme.breakpoints.up("md")]: {
          maxWidth: theme.breakpoints.values.md,
        },
        marginLeft: "auto",
        marginRight: "auto",
        t: 0,
        p: 0,
        borderRadius: 0,
      })}
    >
      <Card
        sx={{
          mt: 0,
          p: 0,
          borderRadius: 0,
          height: "100%",
          minHeight: "100vh",
          boxShadow: "none",
        }}
      >
        <CardHeader></CardHeader>
        <CardContent>
          <MathJaxContext>
            <Container maxWidth="lg">
              <Box
                sx={{
                  py: { xs: 2, sm: 3, md: 4 },
                  px: { xs: 2, sm: 3 },
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 3, sm: 4, md: 6 },
                }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
                  }}
                >
                  M/M/s/K Queue System Analysis
                </Typography>

                <Divider />

                <section>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                    }}
                  >
                    System Parameters
                  </Typography>
                  <Box sx={{ ml: { xs: 2, sm: 4 } }}>
                    <MathJax>
                      {`\\[
                  \\begin{align*}
                  & \\lambda & \\text{: Arrival rate} \\\\
                  & \\mu & \\text{: Service rate} \\\\
                  & s & \\text{: Number of servers} \\\\
                  & k & \\text{: Maximum number of customers in the system}
                  \\end{align*}
                \\]`}
                    </MathJax>
                  </Box>
                </section>

                <Divider />

                <section>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                    }}
                  >
                    Step-by-Step Calculation
                  </Typography>

                  <Box
                    sx={{ ml: { xs: 2, sm: 4 }, gap: { xs: 2, sm: 3, md: 4 } }}
                  >
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                      <strong>Step 1: Calculate Traffic Intensity (ρ)</strong>
                    </Typography>
                    <MathJax>{`\\[
                \\tau = \\frac{\\lambda}{\\mu}, \\quad \\rho = \\frac{\\tau}{s}
              \\]`}</MathJax>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                      <strong>
                        Step 2: Calculate the probability of no customer in the
                        queue (P0)
                      </strong>
                    </Typography>
                    <MathJax>{`\\[
                P_0 = \\left( \\sum_{i=0}^{s-1} \\frac{\\tau^i}{i!} + \\frac{\\tau^s}{s!} \\frac{1 - \\rho^{k-s+1}}{1 - \\rho} \\right)^{-1}
              \\]`}</MathJax>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                      <strong>
                        Step 3: Calculate the average number of customers in the
                        queue (Lq)
                      </strong>
                    </Typography>
                    <MathJax>{`\\[
                L_q = \\frac{\\rho \\tau^s P_0}{s!(1 - \\rho)^2}
              \\]`}</MathJax>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                      <strong>
                        Step 4: Calculate the average number of customers in the
                        system (L)
                      </strong>
                    </Typography>
                    <MathJax>{`\\[
                L = L_q + \\tau
              \\]`}</MathJax>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                      <strong>
                        Step 5: Calculate the average time spent in the system
                        (W)
                      </strong>
                    </Typography>
                    <MathJax>{`\\[
                W = \\frac{L}{\\lambda}
              \\]`}</MathJax>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                      <strong>
                        Step 6: Calculate the average time spent in the queue
                        (Wq)
                      </strong>
                    </Typography>
                    <MathJax>{`\\[
                W_q = \\frac{L_q}{\\lambda}
              \\]`}</MathJax>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                      <strong>
                        Step 7: Calculate the probability of having
                        &apos;n&apos; customers in the system (Pn)
                      </strong>
                    </Typography>
                    <MathJax>{`\\[
                P_n = \\begin{cases}
                \\frac{\\lambda^n}{n! \\mu^n} P_0 & \\text{if } n \\leq s \\\\
                \\frac{\\lambda^n}{s^{n-s} s! \\mu^n} P_0 & \\text{if } n > s
                \\end{cases}
              \\]`}</MathJax>
                  </Box>
                </section>
              </Box>
            </Container>
          </MathJaxContext>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MMExplanation;
