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
import { getTimeAxisTicks } from "@/utils/graph";

interface DepartureTimelineProps {
  arrivalRate: number;
  serviceRate: number;
  capacity: number;
  t_i: number;
  systemType: DD1KType;
}

const DepartureTimeline: React.FC<DepartureTimelineProps> = ({
  arrivalRate,
  serviceRate,
  capacity,
  t_i,
  systemType,
}) => {
  const generateData = () => {
    const data = [];
    const maxTime = DD1K.graphMaxTime(t_i);
    const timeStep = 1 / arrivalRate;  // Match arrival timeline step
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
      if (t >= firstDepartureTime && (t - firstDepartureTime) % serviceTime < timeStep) {
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
  const maxTime = DD1K.graphMaxTime(t_i);
  // Remove timeAxisTicks as we'll use same configuration as ArrivalTimeline

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      <Typography variant="h6" component="h3">
        Departure Timeline
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
              top: 20, // Match ArrivalTimeline margin
              right: 0,
              left: isMobile ? 0 : 90,
              bottom: isMobile ? 30 : 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              orientation="top"
              label={{
                value: "Time (t)",
                position: "insideTop",
                offset: -25,
              }}
              tick={{ dy: -10 }}
            />
            <XAxis
              xAxisId="customer"
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
            <YAxis
              label={{
                value: "Departure Times",
                angle: -90,
                position: "insideLeft",
                dx: isMobile ? 10 : -20,
                dy: 90,
              }}
            />
            <Tooltip />
            {data.map((entry, index) => (
              <ReferenceLine
                key={index}
                x={entry.time}
                xAxisId={0}
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
      <Typography variant="caption" sx={{ mt: 1, textAlign: "center" }}>
        ◆ Indicates departure times
      </Typography>
    </Box>
  );
};

export default DepartureTimeline;
