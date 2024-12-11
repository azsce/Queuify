"use client";

import React from "react";
import {
  LineChart,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  YAxis,
} from "recharts";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { colors } from "@/constants";
import DD1K from "@/class/dd1k/DD1K";

interface DepartureTimelineProps {
  dd1k: DD1K;
  height?: number;
  subGraph?: boolean;
  showTopAxis?: boolean;
  showBottomAxis?: boolean;
}

const Dd1kDepartureTimeline: React.FC<DepartureTimelineProps> = ({
  dd1k,
  height,
  subGraph,
  showTopAxis,
  showBottomAxis,
}) => {
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
          Departure Timeline
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
              left: isMobile ? 0 : 90,
              bottom: subGraph ? 0 : isMobile ? 30 : 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
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
                dy={-3}
                interval={dd1k.arrivalTime - 1}
                tick={{
                  fontSize: 8,
                  startOffset: dd1k.arrivalTime,
                }}
              />
            )}
            {showBottomAxis && (
              <XAxis
                xAxisId="bottom"
                dataKey="time"
                orientation="bottom"
                tickFormatter={(value) => {
                  const r = data.find((entry) => entry.time === value)
                    ?.departured
                    ? `C${data.find((entry) => entry.time === value)?.departures}`
                    : "";

                  return r;
                }}
                tickSize={0}
                tick={{
                  fontSize: 8,
                  dy: 5,
                }}
                tickLine={true}
                axisLine={{
                  stroke: theme.palette.text.primary,
                  strokeWidth: 4,
                }}
                interval={0}
              />
            )}
            <YAxis
              label={{
                value: "Departure",
                angle: -90,
                position: "insideLeft",
                dx: 5,
                dy: 30,
                fontSize: 12,
              }}
              tickLine={false}
              tickSize={subGraph ? 0 : 2}
              axisLine={{
                stroke: "transparent",
                strokeDasharray: "transparent",
              }}
              tickCount={1}
              tickFormatter={() => ""} // Add tick formatter
            />
            {data.map((entry) => (
              <ReferenceLine
                key={entry.key}
                x={entry.time}
                xAxisId={
                  showBottomAxis ? "bottom" : showTopAxis ? "top" : "default"
                }
                stroke={
                  entry.departured
                    ? colors[entry.departures % colors.length]
                    : "transparent"
                }
                strokeWidth={2}
                // label={{
                //   value: entry.departured ? `C${entry.departures}` : "",
                //   position: "bottom",
                //   fill: entry.departured
                //     ? colors[entry.departures % colors.length]
                //     : "transparent",
                //   fontSize: 12,
                // }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
      {!subGraph && (
        <Typography variant="caption" sx={{ mt: 1, textAlign: "center" }}>
          ◆ Indicates departure times
        </Typography>
      )}
    </Box>
  );
};

export default Dd1kDepartureTimeline;
