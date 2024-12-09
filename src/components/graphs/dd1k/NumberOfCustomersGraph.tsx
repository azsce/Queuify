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
import DD1K, { DD1KλExceedμ } from "@/lib/dd1k";
import { DD1KType } from "@/types/dd1k";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { getTimeAxisTicks } from "@/utils/graph";

interface NumberOfCustomersGraphProps {
  arrivalRate: number;
  serviceRate: number;
  capacity: number;
  t_i: number;
  systemType: DD1KType;
  height?: number;
  subGraph?: boolean;
  showTopAxis?: boolean;
  showBottomAxis?: boolean;
}

const NumberOfCustomersGraph: React.FC<NumberOfCustomersGraphProps> = ({
  arrivalRate,
  serviceRate,
  capacity,
  t_i,
  systemType,
  height,
  subGraph,
  showTopAxis,
  showBottomAxis,
}) => {
  const generateData = () => {
    const data = [];
    const maxTime = DD1K.graphMaxTime(t_i);
    const timeStep = 1;

    for (let t = 0; t <= maxTime; t += timeStep) {
      const customers = DD1KλExceedμ.computeNOfT(
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
    }
    return data;
  };

  const data = generateData();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const maxTime = DD1K.graphMaxTime(t_i);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: subGraph ? 0 : 2,
      }}
    >
      {!subGraph && (
        <Typography variant="h6" component="h3">
          Number of Customers vs Time
        </Typography>
      )}
      <Box
        sx={{
          width: "100%",
          height: height || (isMobile ? 400 : 500),
          borderRadius: subGraph ? 0 : 2,
          border: subGraph ? 0 : 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          p: subGraph ? 0 : { xs: 0, sm: 4 },
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
            {!showTopAxis && !showBottomAxis && (
              <XAxis dataKey="time" xAxisId="default" hide={true} />
            )}
            {showTopAxis && (
              <XAxis
                dataKey="time"
                xAxisId="top"
                orientation="top"
                label={{
                  value: "Time (t)",
                  position: "insideTop",
                  offset: -25,
                }}
                tick={{ dy: -10 }}
                ticks={getTimeAxisTicks(maxTime, arrivalRate)}
              />
            )}
            {showBottomAxis && (
              <XAxis
                dataKey="time"
                xAxisId="bottom"
                orientation="bottom"
                label={{
                  value: "Time (t)",
                  position: "insideBottom",
                  offset: -10,
                  dy: 10,
                }}
                ticks={getTimeAxisTicks(maxTime, arrivalRate)}
              />
            )}
            <YAxis
              label={{
                value: "Number of Customers n(t)",
                angle: -90,
                position: "insideLeft",
                dx: isMobile ? 10 : -20,
                dy: 105,
              }}
              allowDecimals={false}
              domain={[0, capacity]}
              stroke={theme.palette.primary.main}
            />
            <Tooltip />
            <Line
              type="stepAfter"
              dataKey="customers"
              stroke="#8884d8"
              name="Customers in System"
              dot={false}
              strokeWidth={2}
              xAxisId={
                showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
              } // Add this line
            />
            <ReferenceLine
              x={t_i}
              xAxisId={
                showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
              }
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

export default NumberOfCustomersGraph;
