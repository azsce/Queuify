"use client";

import React from "react";
import {
  LineChart,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import DD1K from "@/class/dd1k/DD1K";

type EmptyGraphProps = {
  dd1k: DD1K;
  height?: number;
  subGraph?: boolean;
  showTopAxis?: boolean;
  showBottomAxis?: boolean;
  xAxisMax?: number;
};

const EmptyGraph: React.FC<EmptyGraphProps> = ({
  dd1k,
  height,
  subGraph,
  showTopAxis,
  showBottomAxis,
  xAxisMax,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const data = dd1k.generateXAxisSteps(xAxisMax);
  console.log("EmptyGraph data", data);

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
          Empty Graph
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
            {/* Add default XAxis when neither custom axis is shown */}
            {!showTopAxis && !showBottomAxis && (
              <XAxis dataKey="time" xAxisId="default" hide={true} 
              
              />
            )}
            {showTopAxis && (
              <XAxis
                dataKey="time"
                orientation="top"
                xAxisId="top"
                stroke="transparent"
              />
            )}
            {showBottomAxis && (
              <XAxis
                xAxisId="bottom"
                orientation="bottom"
                stroke="transparent"
              />
            )}
            <YAxis/>
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default EmptyGraph;
