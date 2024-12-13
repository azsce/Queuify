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
import Dd1k from "@/class/dd1k/Dd1k";
import ThemedToolTip from "../ThemedToolTip";

interface WaitingTimeGraphProps {
  dd1k: Dd1k;
  height?: number;
  subGraph?: boolean;
  showTopAxis?: boolean;
  showBottomAxis?: boolean;
}

const Dd1kWaitingTimeGraph: React.FC<WaitingTimeGraphProps> = ({
  dd1k,
  height,
  subGraph,
  showTopAxis,
  showBottomAxis,
}) => {
  const data = dd1k.customerGraphData;

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
          Waiting Time vs Customer Number
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
              <XAxis dataKey="customer" xAxisId="default" hide={true} />
            )}
            {showTopAxis && (
              <XAxis
                dataKey="customer"
                xAxisId="top"
                orientation="top"
                label={{
                  value: "nth Customer",
                  position: "insideTop",
                  offset: -25,
                  fill: theme.palette.text.primary,
                }}
                tick={{ dy: -10 }}
              />
            )}
            {showBottomAxis && (
              <XAxis
                dataKey="customer"
                xAxisId="bottom"
                orientation="bottom"
                label={{
                  value: "Customer (n)",
                  position: "insideBottom",
                  offset: -10,
                  dy: -8,
                  fontSize: 12,
                  fill: theme.palette.text.primary,
                }}
                height={40}
                tick={{
                  dy: 10,
                  fontSize: 8,
                  fill: theme.palette.text.primary,
                }}
                stroke={theme.palette.primary.main}
              />
            )}
            <YAxis
              label={{
                value: "Waiting Time Wq(n)",
                angle: -90,
                position: "insideLeft",
                dx: 20,
                dy: 40,
                fontSize: isMobile ? 8 : 12,
                fill: theme.palette.text.primary,
              }}
              stroke={theme.palette.text.primary}
              allowDecimals={false}
              tick={{ fontSize: 8, fill: theme.palette.text.primary }}
            />
            <Tooltip content={<ThemedToolTip labelKey="Customer" />} />
            <Line
              type="stepAfter"
              dataKey="waitingTime"
              stroke="#8884d8"
              name="Waiting Time"
              dot={false}
              strokeWidth={2}
              xAxisId={
                showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
              }
            />
            <ReferenceLine
              x={dd1k.lambdaTiFloored}
              xAxisId={
                showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
              }
              stroke="red"
              label={{
                value: `n = ⌊λ*t_i⌋`,
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

export default Dd1kWaitingTimeGraph;
