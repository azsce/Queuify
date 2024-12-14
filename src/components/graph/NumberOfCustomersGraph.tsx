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
import ThemedToolTip from "./ThemedToolTip";
import { QueueSystem } from "@/class/QueueSystem";

interface NumberOfCustomersGraphProps {
  queueSystem: QueueSystem;
  height?: number;
  subGraph?: boolean;
  showTopAxis?: boolean;
  showBottomAxis?: boolean;
}

const NumberOfCustomersGraph: React.FC<NumberOfCustomersGraphProps> = ({
  queueSystem,
  height,
  subGraph,
  showTopAxis,
  showBottomAxis,
}) => {
  const data = queueSystem.timeLineData;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
          p: subGraph ? 0 : { xs: 0, sm: 4 },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 0,
              left: -20,
              bottom: isMobile ? 30 : 50,
            }}
          >
            <CartesianGrid
              strokeDasharray="2 2"
              strokeOpacity={theme.palette.mode === "dark" ? 0.1 : "0.4"}
            />
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
                  fill: theme.palette.text.primary,
                }}
                tick={{ dy: -10 }}
                interval={queueSystem.arrivalTime - 1}
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
                  dy: -8,
                  fontSize: 12,
                  fill: theme.palette.text.primary,
                }}
                tickSize={0}
                tick={{ dy: 5, fontSize: 8, fill: theme.palette.text.primary }}
                interval={queueSystem.arrivalTime - 1}
              />
            )}
            <YAxis
              label={{
                value: "Number of Customers n(t)",
                angle: -90,
                position: "insideLeft",
                dx: 20,
                dy: isMobile ? 50 : 105,
                fontSize: isMobile ? 8 : 12,
                fill: theme.palette.text.primary,
              }}
              tick={{ fontSize: 8 }}
              tickSize={0}
              stroke={theme.palette.text.primary}
              allowDecimals={false}
              domain={[0, queueSystem.capacity]}
            />
            <Tooltip content={<ThemedToolTip labelKey="Time" />} />
            <Line
              type="stepAfter"
              dataKey="numberOfCustomers"
              stroke={theme.palette.mode === "dark" ? "#d884d1" : "#6f2169"}
              name="Customers in System"
              dot={false}
              strokeWidth={2}
              xAxisId={
                showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
              } // Add this line
            />
            <ReferenceLine
              x={queueSystem.timeSpecialValue}
              xAxisId={
                showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
              }
              stroke="red"
              label={{
                value: `t = t_i`,
                position: "top",
                fill: "red",
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
