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

type Dd1kArrivalTimelineProps = {
  dd1k: DD1K;
  height?: number;
  subGraph?: boolean;
  showTopAxis?: boolean;
  showBottomAxis?: boolean;
};

const Dd1kArrivalTimeline: React.FC<Dd1kArrivalTimelineProps> = ({
  dd1k,
  height,
  subGraph,
  showTopAxis,
  showBottomAxis,
}) => {
  const data = dd1k.timeLineData;

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
          Arrival Timeline
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
              left: -20,
              bottom: subGraph ? 0 : isMobile ? 30 : 50,
            }}
          >
            <CartesianGrid
              strokeDasharray="2 2"
              strokeOpacity={theme.palette.mode === "dark" ? 0.1 : "0.4"}
            />
            {/* Add default XAxis when neither custom axis is shown */}
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
                }} // Set the color of the axis line to black
                dy={-3}
                tickFormatter={(value) => {
                  if (value % dd1k.arrivalTime === 0 && value !== 0) {
                    return value;
                  }
                  return "";
                }}
                interval={0}
                tick={{
                  fontSize: 8,
                  fill: theme.palette.text.primary,
                }}
              />
            )}
            {showBottomAxis && (
              <XAxis
                xAxisId="bottom"
                dataKey="time"
                orientation="bottom"
                tickFormatter={(value) => {
                  const r = data.find((entry) => entry.time === value)?.arrived
                    ? `C${data.find((entry) => entry.time === value)?.arrivals}`
                    : "";

                  return r;
                }}
                tickSize={0}
                tick={{
                  fontSize: 8,
                  dy: 5,
                  fill: theme.palette.text.primary,
                }}
                tickLine={true}
                axisLine={{
                  stroke: theme.palette.text.primary,
                  // strokeWidth: 2,
                }} // Set the color of the axis line to black
                interval={dd1k.arrivalTime - 1}
              />
            )}
            <YAxis
              label={{
                value: "Arrives",
                angle: -90,
                position: "insideLeft",
                dx: 20,
                dy: 25,
                fontSize: 12,
                fill: theme.palette.text.primary,
              }}
              tickCount={1}
              tickFormatter={() => ""} // Add tick formatter
              stroke="transparent"
            />
            <Tooltip />

            {data.map((entry) => (
              <ReferenceLine
                key={entry.key}
                x={entry.time}
                xAxisId={
                  showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
                }
                stroke={
                  entry.arrived
                    ? entry.blocked
                      ? "red"
                      : colors[entry.arrivals % colors.length]
                    : "transparent"
                }
                strokeWidth={2}
                strokeDasharray={entry.blocked ? "3 3" : "none"}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
      {!subGraph && (
        <Typography
          variant="caption"
          sx={{ color: "red", mt: 1, textAlign: "center" }}
        >
          ⊗ Red lines indicate blocked customers
        </Typography>
      )}
    </Box>
  );
};

export default Dd1kArrivalTimeline;
