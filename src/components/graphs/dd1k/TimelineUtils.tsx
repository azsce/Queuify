import { colors } from "@/constants";
import { ReferenceLine } from "recharts";
import React from "react";

interface TimelineData {
  time: string;
  customerArrives: string;
  customerEnteringService: string;
  customerDeparting: string;
}

interface TimelineConfig {
  yAxisOffsets: {
    timeline: number;
  };
  sectionHeight: number;
  xAxisId?: "top" | "bottom" | "default";
}

type TimelineLinesProps = {
  adjustedData: TimelineData[];
  config: TimelineConfig;
};

const TimelineLines: React.FC<TimelineLinesProps> = ({
  adjustedData,
  config,
}) => {
  const basePosition = config.yAxisOffsets.timeline;
  const spacing = config.sectionHeight / 4; // Use quarter height for spacing

  return (
    <>
      {/* Customer Arrivals */}
      {adjustedData.map(
        (entry, index) =>
          entry.customerArrives && (
            <ReferenceLine
              key={`arrival-${index}`}
              x={entry.time}
              y={basePosition}
              xAxisId={config.xAxisId || "bottom"}
              stroke={
                colors[parseInt(entry.customerArrives.slice(1)) % colors.length]
              }
              label={{
                value: "○",
                position: "center",
                dy: -spacing,
                fill: colors[
                  parseInt(entry.customerArrives.slice(1)) % colors.length
                ],
                fontSize: 16,
              }}
            />
          )
      )}
      {/* Service Entry */}
      {adjustedData.map(
        (entry, index) =>
          entry.customerEnteringService && (
            <ReferenceLine
              key={`service-${index}`}
              x={entry.time}
              y={basePosition + spacing}
              xAxisId={config.xAxisId || "bottom"}
              stroke={
                colors[
                  parseInt(entry.customerEnteringService.slice(1)) %
                    colors.length
                ]
              }
              label={{
                value: "□",
                position: "center",
                fill: colors[
                  parseInt(entry.customerEnteringService.slice(1)) %
                    colors.length
                ],
                fontSize: 16,
              }}
            />
          )
      )}
      {/* Departures */}
      {adjustedData.map(
        (entry, index) =>
          entry.customerDeparting && (
            <ReferenceLine
              key={`departure-${index}`}
              x={entry.time}
              y={basePosition + spacing * 2}
              xAxisId={config.xAxisId || "bottom"}
              stroke={
                colors[
                  parseInt(entry.customerDeparting.slice(1)) % colors.length
                ]
              }
              label={{
                value: "◆",
                position: "center",
                dy: spacing,
                fill: colors[
                  parseInt(entry.customerDeparting.slice(1)) % colors.length
                ],
                fontSize: 16,
              }}
            />
          )
      )}
    </>
  );
};

export default TimelineLines;
