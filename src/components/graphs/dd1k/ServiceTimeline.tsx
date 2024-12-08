
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

interface ServiceTimelineProps {
  arrivalRate: number;
  serviceRate: number;
  capacity: number;
  t_i: number;
  systemType: DD1KType;
}

const ServiceTimeline: React.FC<ServiceTimelineProps> = ({
  arrivalRate,
  serviceRate,
  capacity,
  t_i,
  systemType,
}) => {
  const generateData = () => {
    const data = [];
    const maxTime = DD1K.graphMaxTime(t_i);
    const timeStep = 1 / serviceRate; // Use service rate for time steps

    // Start with t=0 for initial state
    data.push({
      time: "0",
      service: 0,
      customerIndex: "",
    });

    let currentCustomer = 1;
    // Generate service completion times
    for (let t = timeStep; t <= maxTime; t += timeStep) {
      const n = DD1K.computeNOfT(t, arrivalRate, serviceRate, t_i, capacity, systemType);
      
      // A service completion occurs at this time
      if (DD1K.isServiceCompletion(t, serviceRate)) {
        // Only increment customer if there were customers to serve
        if (n > 0 || t >= 1/arrivalRate) {
          data.push({
            time: t.toFixed(2),
            service: currentCustomer,
            customerIndex: `C${currentCustomer}`,
          });
          currentCustomer++;
        } else {
          data.push({
            time: t.toFixed(2),
            service: 0,
            customerIndex: "",
          });
        }
      }
    }
    return data;
  };

  const data = generateData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      <Typography variant="h6" component="h3">
        Service Timeline
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
                value: "Customer Served",
                position: "insideBottom",
                offset: -10,
                dy: 10,
              }}
              height={40}
              tick={{ dy: 10 }}
            />
            <YAxis
              label={{
                value: "Service Times",
                angle: -90,
                position: "insideLeft",
                dx: isMobile ? 10 : -20,
                dy: isMobile ? 90 : 90,
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
                    : colors[parseInt(entry.customerIndex.slice(1)) % colors.length]
                }
                label={{
                  value: "◆",
                  position: "top",
                  fill: colors[parseInt(entry.customerIndex.slice(1)) % colors.length],
                  fontSize: 12,
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Typography variant="caption" sx={{ mt: 1, textAlign: "center" }}>
        ◆ Indicates service completion times
      </Typography>
    </Box>
  );
};

export default ServiceTimeline;