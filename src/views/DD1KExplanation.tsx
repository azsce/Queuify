"use client";

import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Box, Container, Divider, Typography } from "@mui/material";
import { useEffect } from "react";

const DD1KExplanation = () => {
  useEffect(() => {
    // eslint-disable-next-line
    window.MathJax && window.MathJax.typeset();
  }, []);

  return (
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
            D/D/1/(k-1) Queue System Analysis
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
                  & k & \\text{: Total capacity (including customer in service)} \\\\
                  & t_i & \\text{: Time of first balk}
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
              Case 1: λ {">"} μ (Arrival Rate Exceeds Service Rate)
            </Typography>

            <Box sx={{ ml: { xs: 2, sm: 4 }, gap: { xs: 2, sm: 3, md: 4 } }}>
              <Typography variant="body1">
                When arrival rate exceeds service rate, the queue will
                eventually saturate and new arrivals will be rejected.
              </Typography>

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                For n(t):
              </Typography>
              <Box sx={{ ml: { xs: 3, sm: 5 } }}>
                <Typography sx={{ mb: 1 }}>When t {"<"} 1/λ:</Typography>
                <MathJax>{`\\[n(t) = 0\\]`}</MathJax>

                <Typography sx={{ mb: 1, mt: 2 }}>
                  When 1/λ ≤ t {"<"} t_i:
                </Typography>
                <MathJax>{`\\[n(t) = \\lfloor\\frac{t}{\\lambda}\\rfloor - \\lfloor\\frac{t}{\\mu} - \\frac{1}{\\mu}\\rfloor\\]`}</MathJax>

                <Typography sx={{ mb: 1, mt: 2 }}>When t ≥ t_i:</Typography>
                <MathJax>{`\\[n(t) \\text{ alternates between } k-1 \\text{ and } k-2\\]`}</MathJax>
              </Box>

              <Typography variant="subtitle1" sx={{ mt: 3 }}>
                For waiting times W_q(n):
              </Typography>
              <Box sx={{ ml: { xs: 3, sm: 5 } }}>
                <Typography sx={{ mb: 1 }}>When n {"<"} λt_i:</Typography>
                <MathJax>{`\\[W_q(n) = (\\frac{1}{\\mu} - \\frac{1}{\\lambda})(n - 1)\\]`}</MathJax>

                <Typography sx={{ mb: 1, mt: 2 }}>When n ≥ λt_i:</Typography>
                <MathJax>{`\\[W_q(n) \\text{ alternates between:}\\]`}</MathJax>
                <Box sx={{ ml: { xs: 2, sm: 4 } }}>
                  <MathJax>{`\\[(\\frac{1}{\\mu} - \\frac{1}{\\lambda})(\\lambda t_i - 2)\\]`}</MathJax>
                  <Typography sx={{ my: 1 }}>and</Typography>
                  <MathJax>{`\\[(\\frac{1}{\\mu} - \\frac{1}{\\lambda})(\\lambda t_i - 3)\\]`}</MathJax>
                </Box>
              </Box>
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
              Case 2: λ ≤ μ (Service Rate Exceeds or Equals Arrival Rate)
            </Typography>

            <Box sx={{ ml: { xs: 2, sm: 4 }, gap: { xs: 2, sm: 3, md: 4 } }}>
              <Typography variant="body1">
                In this case, there is never more than one customer in the
                system. The queue starts with M initial customers until reaching
                steady state.
              </Typography>

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                For n(t):
              </Typography>
              <Box sx={{ ml: { xs: 3, sm: 5 } }}>
                <Typography sx={{ mb: 1 }}>General equation:</Typography>
                <MathJax>{`\\[n(t) = M + \\lfloor\\lambda t\\rfloor - \\lfloor\\mu t\\rfloor\\]`}</MathJax>
              </Box>

              <Typography variant="subtitle1" sx={{ mt: 3 }}>
                For waiting times W_q(n):
              </Typography>
              <Box sx={{ ml: { xs: 3, sm: 5 } }}>
                <Typography sx={{ mb: 1 }}>Initial state (n = 0):</Typography>
                <MathJax>{`\\[W_q(0) = \\frac{M - 1}{2\\mu}\\]`}</MathJax>

                <Typography sx={{ mb: 1, mt: 2 }}>
                  When n {"<"} ⌊λt_i⌋:
                </Typography>
                <MathJax>{`\\[W_q(n) = (M - 1 + n)\\frac{1}{\\mu} - n\\frac{1}{\\lambda}\\]`}</MathJax>

                <Typography sx={{ mb: 1, mt: 2 }}>When n ≥ ⌊λt_i⌋:</Typography>
                <MathJax>{`\\[W_q(n) = 0\\]`}</MathJax>
              </Box>
            </Box>
          </section>
        </Box>
      </Container>
    </MathJaxContext>
  );
};

export default DD1KExplanation;
