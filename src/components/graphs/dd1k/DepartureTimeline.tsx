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
import { DD1KType } from "@/types/dd1k";
import DD1K from "@/lib/dd1k";
import { colors } from "@/constants";

interface DepartureTimelineProps {
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

const DepartureTimeline: React.FC<DepartureTimelineProps> = ({
  arrivalRate,
  serviceRate,
  t_i,
  height,
  subGraph,
  showTopAxis,
  showBottomAxis,
}) => {
  const generateData = () => {
    const data = [];
    const maxTime = DD1K.graphMaxTime(t_i);
    const timeStep = 1 / arrivalRate; // Match arrival timeline step
    const serviceTime = 1 / serviceRate;
    const firstDepartureTime = 1 / arrivalRate + serviceTime;

    // Start with t=0 for initial state
    data.push({
      time: "0",
      departure: 0,
      customerIndex: "",
    });

    let currentCustomer = 1;

    // Generate data points for each time step
    for (let t = timeStep; t <= maxTime; t += timeStep) {
      const roundedTime = Math.round(t).toString();
      if (
        t >= firstDepartureTime &&
        (t - firstDepartureTime) % serviceTime < timeStep
      ) {
        data.push({
          time: roundedTime,
          service: currentCustomer,
          customerIndex: `C${currentCustomer++}`,
        });
      } else {
        data.push({
          time: roundedTime,
          service: null,
          customerIndex: "",
        });
      }
    }
    return data;
  };

  const data = generateData();
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
              />
            )}
            {showBottomAxis && (
              <XAxis
                xAxisId="bottom"
                dataKey="customerIndex"
                orientation="bottom"
                label={{
                  value: "Customer Departed",
                  position: "insideBottom",
                  offset: -10,
                  dy: 10,
                }}
                height={40}
                tick={{ dy: 10 }}
              />
            )}
            <YAxis
              label={{
                value: "Departure TimeLine",
                angle: -90,
                position: "insideLeft",
                dx: isMobile ? 10 : -20,
                dy: 90,
              }}
              tickCount={1}
              tickFormatter={() => ""} // Add tick formatter
            />
            <Tooltip />
            {data.map((entry, index) => (
              <ReferenceLine
                key={index}
                x={entry.time}
                xAxisId={
                  showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
                }
                stroke={
                  entry.customerIndex === ""
                    ? "transparent"
                    : colors[
                        parseInt(entry.customerIndex.slice(1)) % colors.length
                      ]
                }
                label={{
                  value: "◆",
                  position: "top",
                  fill: colors[
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
          ◆ Indicates departure times
        </Typography>
      )}
    </Box>
  );
};

export default DepartureTimeline;
