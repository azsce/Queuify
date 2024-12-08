"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { DD1KType } from "@/types/dd1k";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import DD1K from "@/lib/dd1k";

interface WaitingTimeGraphProps {
  arrivalRate: number;
  serviceRate: number;
  capacity: number;
  t_i: number;
  systemType: DD1KType;
}

const WaitingTimeGraph: React.FC<WaitingTimeGraphProps> = ({
  arrivalRate,
  serviceRate,
  capacity,
  t_i,
  systemType,
}) => {
  const maxCustomers = Math.ceil(arrivalRate * t_i * 2); // Ensure we show enough customers after t_i

  const generateData = () => {
    const data = [];

    for (let n = 0; n <= maxCustomers; n++) {
      const waitingTime = DD1K.computeWqOfN(
        n,
        arrivalRate,
        serviceRate,
        t_i,
        systemType
      );
      data.push({
        customer: n,
        waitingTime: waitingTime,
      });
    }
    return data;
  };

  const data = generateData();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 2,
      }}
    >
      <Typography variant="h6" component="h3">
        Waiting Time vs Customer Number
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: isMobile ? 400 : 500,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          p: { xs: 0, sm: 4 },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 0,
              left: isMobile ? 0 : 90,
              bottom: isMobile ? 30 : 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="customer"
              label={{
                value: "Customer Number (n)",
                position: "insideBottom",
                offset: -10,
                dy: 10,
              }}
            />
            <YAxis
              label={{
                value: "Waiting Time Wq(n)",
                angle: -90,
                position: "insideLeft",
                dx: isMobile ? 10 : -20,
                dy: isMobile ? 90 : 90,
              }}
              allowDecimals={false}
            />
            <Tooltip />
            <Line
              type="stepAfter"
              dataKey="waitingTime"
              stroke="#8884d8"
              name="Waiting Time"
              dot={false}
              strokeWidth={2}
            />
            <ReferenceLine
              x={arrivalRate * t_i}
              stroke={theme.palette.warning.main}
              label={{
                value: `n = λ * t_i`,
                position: "top",
                fill: theme.palette.warning.main,
                fontSize: 12,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default WaitingTimeGraph;
