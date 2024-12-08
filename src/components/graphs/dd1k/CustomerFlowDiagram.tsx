
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
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

interface CustomerFlowDiagramProps {
  arrivalRate: number;
  serviceRate: number;
  capacity: number;
  t_i: number;
}

const CustomerFlowDiagram: React.FC<CustomerFlowDiagramProps> = ({
  arrivalRate,
  serviceRate,
  capacity,
  t_i,
}) => {
  const generateData = () => {
    const data = [];
    const maxTime = 100;
    const timeStep = 1;

    for (let t = 0; t <= maxTime; t += timeStep) {
      const arrivals = Math.floor(t * arrivalRate);
      const departures = Math.floor(t * serviceRate);
      const blocked = arrivals > capacity ? arrivals - capacity : 0;
      data.push({
        time: t,
        arrivals: arrivals,
        departures: departures,
        blocked: blocked,
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
        Customer Flow Diagram
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
                value: "Customers",
                angle: -90,
                position: "insideLeft",
                dx: isMobile ? 10 : -20,
                dy: isMobile ? 90 : 90,
              }}
              allowDecimals={false}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="arrivals"
              stroke="#8884d8"
              name="Arrivals"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="departures"
              stroke="#82ca9d"
              name="Departures"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="blocked"
              stroke="#ff7300"
              name="Blocked"
              dot={false}
              strokeWidth={2}
            />
            <ReferenceLine
              x={t_i}
              stroke={theme.palette.warning.main}
              label={{
                value: `t = t_i`,
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

export default CustomerFlowDiagram;