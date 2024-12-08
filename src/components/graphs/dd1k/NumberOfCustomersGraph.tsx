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
} from "recharts";
import { computeNOfT } from "@/lib/dd1k";
import { DD1KType } from "@/types/dd1k";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

interface NumberOfCustomersGraphProps {
  arrivalRate: number;
  serviceRate: number;
  capacity: number;
  t_i: number;
  systemType: DD1KType;
}

const NumberOfCustomersGraph: React.FC<NumberOfCustomersGraphProps> = ({
  arrivalRate,
  serviceRate,
  capacity,
  t_i,
  systemType,
}) => {
  const generateData = () => {
    const data = [];
    const maxTime = 100;
    const timeStep = 1;

    for (let t = 0; t <= maxTime; t += timeStep) {
      const customers = computeNOfT(
        t,
        arrivalRate,
        serviceRate,
        t_i,
        capacity,
        systemType
      );
      data.push({
        time: t,
        customers: customers,
      });
      console.log("number of customers at time", t, "is", customers);
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
        Number of Customers vs Time
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
              dataKey="time"
              label={{
                value: "Time (t)",
                position: "insideBottom",
                offset: -10,
                dy: 10,
              }}
            />
            <YAxis
              label={{
                value: "Number of Customers n(t)",
                angle: -90,
                position: "insideLeft",
                dx: isMobile ? 10 : -20,
                dy: isMobile ? 90 : 90,
              }}
              allowDecimals={false}
              domain={[0, capacity]}
            />
            <Tooltip />
            <Line
              type="stepAfter"
              dataKey="customers"
              stroke="#8884d8"
              name="Customers in System"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default NumberOfCustomersGraph;
