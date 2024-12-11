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
  xAxisMax?: number;
};

const Dd1kServiceTimeline: React.FC<Dd1kServiceTimelineProps> = ({
  dd1k,
  height,
  subGraph,
  showTopAxis,
  showBottomAxis,
  xAxisMax,
}) => {
  console.log("Dd1kServiceTimeline height", height);
  const data = dd1k.generateServiceTimelineData(xAxisMax);
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
              left: isMobile ? 0 : 90,
              bottom: subGraph ? 0 : isMobile ? 30 : 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {!showTopAxis && !showBottomAxis && (
              <XAxis dataKey="time" xAxisId="default" hide={true} />
            )}
            {showTopAxis && (
              <XAxis
                dataKey="time"
                orientation="top"
                xAxisId="top"
                // label={{
                //   value: "Time (t)",
                //   position: "insideTop",
                //   offset: -25,
                // }}
                // tick={{ dy: -10 }}
                tickSize={0} // Remove ticks
                tickFormatter={() => ""}
                stroke="transparent"
              />
            )}
            {/* {showBottomAxis && (
              <XAxis
                xAxisId="bottom"
                dataKey="customerIndex"
                orientation="bottom"
                label={{
                  value: "Customer Served",
                  position: "insideBottom",
                  offset: -10,
                  dy: 10,
                }}
                height={40}
                tick={{ dy: 10 }}
              />
            )} */}
            <YAxis
              label={{
                value: "-> Service",
                angle: -90,
                position: "insideLeft",
                dx: isMobile ? 10 : -20,
                dy: 70,
              }}
              tickCount={1}
              tickFormatter={() => ""} // Add tick formatter
            />
            <Tooltip />
            {data.map((entry) => (
              <ReferenceLine
                key={entry.time}
                x={entry.time}
                xAxisId={
                  showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
                }
                stroke={
                  entry.customerIndex === ""
                    ? "transparent"
                    : entry.isInitialCustomer
                      ? "black"
                      : colors[
                          parseInt(entry.customerIndex.slice(1)) % colors.length
                        ]
                }
                width={8}
                strokeWidth={4}
                label={{
                  value: entry.customerIndex,
                  position: "top",
                  fill: entry.customerIndex === ""
                  ? "transparent"
                  : entry.isInitialCustomer
                    ? "black"
                    : colors[
                        parseInt(entry.customerIndex.slice(1)) % colors.length
                      ],
                  fontSize: 12,
                }}
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
