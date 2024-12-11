"use client";

import React from "react";
import { DD1KType } from "@/types/dd1k";
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

interface CustomerFlowDiagramProps {
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

const CustomerFlowDiagram: React.FC<CustomerFlowDiagramProps> = ({
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
    const maxTime = 50;
    const timeStep = 1 / Math.max(arrivalRate, serviceRate); // More precise step size
    let totalBlocked = 0;

    for (let t = 0; t <= maxTime; t += timeStep) {
      const arrivals = Math.floor(t * arrivalRate);
      const departures = Math.floor(t * serviceRate);
      const isBlocked = false;
      //  DD1KλExceedμ.isCustomerBlocked(
      //   t,
      //   arrivalRate,
      //   serviceRate,
      //   capacity,
      //   t_i,
      //   systemType
      // );

      if (isBlocked) {
        totalBlocked++;
      }

      data.push({
        time: t,
        arrivals: arrivals,
        departures: departures,
        blocked: totalBlocked,
      });
    }
    return data;
  };

  const data = generateData();

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
          Customer Flow Diagram
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
              top: 30,
              right: 0,
              left: isMobile ? 0 : 90,
              bottom: subGraph ? 0 : isMobile ? 30 : 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* Add time axis at the top */}
            {showTopAxis && (
              <XAxis
                dataKey="time"
                orientation="top"
                xAxisId="top"
                label={{
                  value: "Time (t)",
                  position: "insideTop",
                  offset: -25,
                }}
                tick={{ dy: -10 }}
                stroke={theme.palette.primary.main}
              />
            )}
            {/* Keep existing bottom axis for customer index */}
            {showBottomAxis && (
              <XAxis
                xAxisId="bottom"
                dataKey="customerIndex"
                orientation="bottom"
                label={{
                  value: "Customer Index",
                  position: "insideBottom",
                  offset: -10,
                  dy: 10,
                }}
                height={40}
                tick={{ dy: 10 }}
                stroke={theme.palette.primary.main}
              />
            )}
            {!showTopAxis && !showBottomAxis && (
              <XAxis dataKey="time" xAxisId="default" hide={true} />
            )}
            <YAxis
              label={{
                value: "Customer Flow",
                angle: -90,
                position: "insideLeft",
                dx: isMobile ? 10 : -20,
                dy: 60,
              }}
              allowDecimals={false}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="arrivals"
              stroke="#8884d8"
              name="Arrivals"
              dot={false}
              strokeWidth={2}
              xAxisId={
                showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
              }
            />
            <Line
              type="monotone"
              dataKey="departures"
              stroke="#82ca9d"
              name="Departures"
              dot={false}
              strokeWidth={2}
              xAxisId={
                showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
              }
            />
            <Line
              type="monotone"
              dataKey="blocked"
              stroke="#ff7300"
              name="Blocked"
              dot={false}
              strokeWidth={2}
              xAxisId={
                showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
              }
            />
            <ReferenceLine
              x={t_i}
              xAxisId={
                showTopAxis ? "top" : showBottomAxis ? "bottom" : "default"
              }
              stroke={theme.palette.warning.main}
              label={{
                value: `t = t_i`,
                position: "top",
                fill: theme.palette.warning.main,
                fontSize: 12,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default CustomerFlowDiagram;
