/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DD1KType } from "@/types/dd1k";
import DD1K from "@/lib/dd1k";
import {
  generateBasicData,
  generateTimeLineData,
} from "@/utils/graphDataUtils";
import renderTimeLines from "./TimelineUtils";

/**
 * Combined Graph Layout Organization
 * ---------------------------------
 * The graph is divided into 6 equal-height sections from top to bottom:
 *
 * 1. Number of Customers Section
 *    - Scale: customers count scaled to section height
 *    - Virtual Y-Axis: 0 to max customers
 *    - X-Axis: Time (t)
 *
 * 2. Customer Flow Section
 *    - Scale: metrics (arrivals/departures/blocked) scaled to section height
 *    - Virtual Y-Axis: 0 to max flow value
 *    - X-Axis: Time (t)
 *
 * 3. Waiting Time Section
 *    - Scale: waitingTime values scaled to section height
 *    - Virtual Y-Axis: 0 to max waiting time
 *    - X-Axis: Customer (n)
 *
 * Spacing: Equal spacing between all sections
 * Height: All sections have equal height (sectionHeight)
 */

interface CombinedGraphProps {
  arrivalRate: number;
  serviceRate: number;
  capacity: number;
  t_i: number;
  systemType: DD1KType;
  height?: number;
}

const CombinedGraph: React.FC<CombinedGraphProps> = ({
  arrivalRate,
  serviceRate,
  capacity,
  t_i,
  systemType,
  height = 1000,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const arrivalTime = 1 / arrivalRate;
  const maxTime = DD1K.graphMaxTime(t_i);

  const basicData = generateBasicData(
    maxTime,
    arrivalRate,
    serviceRate,
    capacity,
    t_i,
    systemType
  );

  // Calculate section heights and related metrics
  // const {
  //   sectionHeight,
  //   sectionSpacing,
  //   scaleFactors,
  //   yAxisOffsets,
  //   totalHeight,
  // } = calculateSectionHeights(basicData, height);

  // Now yAxisOffsets will be properly typed
  // const adjustedData = adjustBasicData(basicData, scaleFactors, yAxisOffsets);

  // // Add section dividers
  // const sectionDividers = Object.values(yAxisOffsets)
  //   .slice(1)
  //   .map((offset) => offset - sectionSpacing / 2);

  // Add vertical axis ticks for each section using imported sections
  // const yAxisTicks = Object.values(sections).flatMap((sectionIndex) => [
  //   sectionIndex * (sectionHeight + sectionSpacing),
  //   sectionIndex * (sectionHeight + sectionSpacing) + sectionHeight * 0.5,
  //   (sectionIndex + 1) * (sectionHeight + sectionSpacing),
  // ]);

  const timeLineData = generateTimeLineData(basicData);

  // Replace the commented for loop with this

  // Calculate ticks
  const ticks: string[] = [];
  for (let i = 0; i <= maxTime; i += arrivalTime) {
    ticks.push("C" + i);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      <Typography variant="h6" component="h3">
        Combined Graph
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: height || (isMobile ? 800 : 1000),
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          p: { xs: 0, sm: 4 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box height="100%">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              layout="vertical"
              data={timeLineData}
              margin={{
                top: 15,
                right: 30,
                left: isMobile ? 10 : 90,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                xAxisId={"top"}
                orientation="top"
                tickCount={ticks.length}
                tick={{ dy: -10 }}
                height={50}
                stroke={theme.palette.text.primary}
                label={{
                  value: "Time (t)",
                  position: "insideTop",
                  offset: -5, // Adjusted from -20
                }}
              />
              <YAxis dataKey="state" type="category" />
              {renderTimeLines(arrivalTime, maxTime, basicData)}
            </LineChart>
          </ResponsiveContainer>
        </Box>
        {/* <Box height="50%">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={adjustedData}
              margin={{
                right: 30,
                left: isMobile ? 10 : 90,
                bottom: 50, // Reduced from 80
              }}
            >
              <CartesianGrid strokeDasharray="12 12" />
              <XAxis
                dataKey="time"
                xAxisId="top"
                orientation="top"
                label={{
                  value: "Time (t)",
                  position: "insideTop",
                  offset: -5, // Adjusted from -20
                }}
                height={50} // Increased from 40
                tick={{ dy: -8 }}
                stroke={theme.palette.text.primary} // Add stroke color
                hide={true}
              />
              <XAxis
                dataKey="customer"
                xAxisId="bottom"
                orientation="bottom"
                label={{
                  value: "Customer (n)",
                  position: "insideBottom",
                  offset: -5, // Adjusted from -20
                }}
                height={50} // Increased from 40
                tick={{ dy: 8 }}
                type="number"
                tickCount={ticks.length}
                allowDecimals={false}
                stroke={theme.palette.text.primary} // Add stroke color
              />
              <YAxis
                label={{
                  value: "Combined Metrics",
                  angle: -90,
                  position: "insideLeft",
                  dx: isMobile ? 10 : -20,
                  dy: 90,
                }}
                allowDecimals={false}
                domain={[0, totalHeight]}
                ticks={yAxisTicks}
                tickFormatter={(value) => {
                  // Convert back to original scale based on section
                  if (value <= sectionHeight) {
                    return Math.round(
                      value / scaleFactors.customerFlow
                    ).toString();
                  } else if (value <= 2 * sectionHeight) {
                    return Math.round(
                      (value - yAxisOffsets.customers) / scaleFactors.customers
                    ).toString();
                  } else {
                    return Math.round(
                      (value - yAxisOffsets.waitingTime) /
                        scaleFactors.waitingTime
                    ).toString();
                  }
                }}
                stroke={theme.palette.text.primary}
              />
              {/* Add section dividers */}
        {/* {sectionDividers.map((height) => (
                <ReferenceLine
                  key={`divider-${height}`}
                  y={height}
                  stroke={theme.palette.divider}
                  strokeDasharray="3 3"
                  xAxisId={"bottom"}
                />
              ))} */}
        {/* <Tooltip content={<CustomTooltip data={basicData} />} /> */}
        {/* Add lines for each metric */}
        {/* <Line
                type="stepAfter"
                dataKey="customers"
                xAxisId="top" // Specify xAxisId
                stroke={ColorMap.customers}
                name="Customers in System"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="arrivals"
                xAxisId="top" // Specify xAxisId
                stroke={ColorMap.arrivals}
                name="Arrivals"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="departures"
                xAxisId="top" // Specify xAxisId
                stroke={ColorMap.departures}
                name="Departures"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="blocked"
                xAxisId="top" // Specify xAxisId
                stroke="red"
                name="Blocked"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="stepAfter"
                dataKey="customers"
                xAxisId="bottom" // Specify xAxisId
                stroke={ColorMap.waitingTime}
                name="Customers in System"
                dot={false}
                strokeWidth={2}
              />

              <ReferenceLine
                x={t_i}
                xAxisId="bottom" // Explicitly set to "bottom"
                stroke={theme.palette.warning.main}
                label={{
                  value: `t = t_i`,
                  position: "top",
                  fill: theme.palette.warning.main,
                  fontSize: 12,
                }}
              />
            // </LineChart> */}
        {/* </ResponsiveContainer> */}
        {/* </Box> */}
      </Box>
      <Typography variant="caption" sx={{ mt: 1, textAlign: "center" }}>
        ○ Arrival • □ Service Start • ◆ Departure
      </Typography>
    </Box>
  );
};

export default CombinedGraph;
