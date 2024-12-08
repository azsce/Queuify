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

interface ArrivalTimelineProps {
  arrivalRate: number;
  serviceRate: number;
  capacity: number;
  t_i: number;
  systemType: DD1KType;
}

const colors = [
  "#FF5733", // Red
  "#33FF57", // Green
  "#3357FF", // Blue
  "#FF33A1", // Pink
  "#FF8C33", // Orange
  "#8C33FF", // Purple
  "#33FFF5", // Cyan
];

const ArrivalTimeline: React.FC<ArrivalTimelineProps> = ({
  arrivalRate,
  serviceRate,
  capacity,
  t_i,
  systemType,
}) => {
  const data = DD1K.generateArrivalTimelineData(
    arrivalRate,
    serviceRate,
    capacity,
    t_i,
    systemType
  );

  // Add customer indices to data
  const dataWithCustomers = data.map((point, index) => ({
    ...point,
    customerIndex: index > 0 ? `C${index}` : "", // First index is empty
  }));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 2,
      }}
    >
      <Typography variant="h6" component="h3">
        Arrival Timeline
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
            data={dataWithCustomers}
            margin={{
              top: 40, // Increased top margin for top axis
              right: 30,
              left: isMobile ? 20 : 90,
              bottom: 60, // Increased bottom margin
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* Top time axis */}
            <XAxis
              dataKey="time"
              orientation="top"
              label={{
                value: "Time (t)",
                position: "insideTop",
                offset: -20,
              }}
              // Remove tickFormatter since we're using whole numbers now
            />
            {/* Bottom customer index axis */}
            <XAxis
              xAxisId="customer"
              dataKey="customerIndex"
              orientation="bottom"
              label={{
                value: "Customer Index",
                position: "insideBottom",
                offset: -10,
                dy: 10,
              }}
              height={40} // Add height for better visibility
              tick={{ dy: 10 }} // Move ticks down
            />
            <YAxis hide={true} />
            <Tooltip />
            {dataWithCustomers.map((entry, index) => (
              <ReferenceLine
                key={index}
                x={entry.time}
                xAxisId={0} // Explicitly use top axis
                stroke={entry.blocked ? "red" : colors[index % colors.length]}
                label={{
                  value: entry.blocked ? `⊗` : `${entry.arrival}`,
                  position: "top",
                  fill: entry.blocked ? "red" : colors[index % colors.length],
                  fontSize: 12,
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ArrivalTimeline;
