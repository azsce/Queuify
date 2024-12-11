"use client";

import React from "react";
import {
  LineChart,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  YAxis,
} from "recharts";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { colors } from "@/constants";
import DD1K from "@/class/dd1k/DD1K";

type Dd1kServiceTimelineProps = {
  dd1k: DD1K;
  height?: number;
  subGraph?: boolean;
  showTopAxis?: boolean;
  showBottomAxis?: boolean;
};

const Dd1kServiceTimeline: React.FC<Dd1kServiceTimelineProps> = ({
  dd1k,
  height,
  subGraph,
  showTopAxis,
  showBottomAxis,
}) => {
  console.log("Dd1kServiceTimeline height", height);
  const data = dd1k.timeLineData;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // Remove timeAxisTicks as we'll use same configuration as ArrivalTimeline

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
          Service Timeline
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
              top: subGraph ? 0 : 20,
              right: 0,
              left: isMobile ? -20 : 90,
              bottom: subGraph ? 0 : isMobile ? 30 : 50,
            }}
          >
            <CartesianGrid strokeDasharray="2 2" strokeOpacity={theme.palette.mode === "dark" ? 0.1 : "0.4"} />
            {!showTopAxis && !showBottomAxis && (
              <XAxis dataKey="time" xAxisId="default" hide={true} />
            )}
            {showTopAxis && (
              <XAxis
                dataKey="time"
                orientation="top"
                xAxisId="top"
                tickLine={false}
                tickSize={subGraph ? 0 : 2}
                axisLine={{
                  stroke: "transparent",
                  strokeDasharray: "transparent",
                }}
                tickFormatter={(value) => {
                  if (value % dd1k.arrivalTime === 0 && value !== 0) {
                    return value;
                  }
                  return "";
                }}
                dy={-3}
                interval={dd1k.arrivalTime - 1}
                tick={{
                  fontSize: 8,
                  color: theme.palette.text.primary,
                }}
              />
            )}
            {showBottomAxis && (
              <XAxis
                xAxisId="bottom"
                dataKey="time"
                orientation="bottom"
                tickFormatter={(value) => {
                  const d = data.find((entry) => entry.time === value);
                  if (d?.enteredService) {
                    if (d.initialEnteredService) {
                      return `M${data.find((entry) => entry.time === value)?.initialServiceEnterances}`;
                    } else {
                      return `C${data.find((entry) => entry.time === value)?.serviceEnterancs}`;
                    }
                  }
                  return "";
                }}
                tickSize={0}
                tick={{
                  fontSize: 8,
                  dy: 5,
                  color: theme.palette.secondary.main,
                }}
                colorRendering="optimizeQuality"
                tickLine={true}
                axisLine={{
                  stroke: theme.palette.secondary.main,
                  strokeWidth: 4,
                }}
                interval={0}
              />
            )}
            <YAxis
              label={{
                value: "-> Service",
                angle: -90,
                position: "insideLeft",
                dx: 20,
                dy: 40,
                fontSize: 12,
              }}
              tickCount={1}
              stroke="transparent"
              tickFormatter={() => ""} // Add tick formatter
            />
            <Tooltip />
            {data.map((entry) => (
              <ReferenceLine
                key={entry.key}
                x={entry.time}
                xAxisId={
                  showBottomAxis ? "bottom" : showTopAxis ? "top" : "default"
                }
                stroke={
                  entry.enteredService && entry.initialEnteredService
                    ? "black"
                    : entry.enteredService
                      ? colors[entry.serviceEnterancs % colors.length]
                      : "transparent"
                }
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
      {!subGraph && (
        <Typography variant="caption" sx={{ mt: 1, textAlign: "center" }}>
          ◆ Indicates service completion times
        </Typography>
      )}
    </Box>
  );
};

export default Dd1kServiceTimeline;
