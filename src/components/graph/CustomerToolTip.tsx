import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

import { roundTo4Decimals } from "@/lib/math";

type CustomerToolTipProps = TooltipProps<ValueType, NameType> & {};

type InfoProps = {
  key: string;
  color: string;
  name: NameType;
  value: ValueType;
};

const Info: React.FC<InfoProps> = ({ key, color, name, value }) => {
  return (
    <Typography
      key={key}
      variant="body2"
      sx={{
        color: color,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          backgroundColor: color,
          borderRadius: "50%",
          display: "inline-block",
          mr: 1,
        }}
      />
      {name}: {roundTo4Decimals(value as number)}
    </Typography>
  );
};

const CustomerToolTip: React.FC<CustomerToolTipProps> = ({
  active,
  payload,
  label,
}) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    console.log(data);
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius,
          p: 1,
          boxShadow: theme.shadows[1],
          gap: 0.5,
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          {"Customer"}: {label}
        </Typography>

        {data.arrivalTime !== undefined && (
          <Info
            key="arrivalTime"
            color={theme.palette.info.main}
            name="Arrival Time"
            value={data.arrivalTime}
          />
        )}
        {data.serviceStartTime !== undefined && (
          <Info
            key="serviceStartTime"
            color={theme.palette.success.main}
            name="Service Start Time"
            value={data.serviceStartTime}
          />
        )}
        {data.departureTime !== undefined && (
          <Info
            key="departureTime"
            color={theme.palette.error.main}
            name="Departure Time"
            value={data.departureTime}
          />
        )}

        {payload.map((entry, index) => (
          <Info
            key={`item-${index}`}
            color={entry.color}
            name={entry.name}
            value={entry.value}
          />
        ))}
      </Box>
    );
  }

  return null;
};

export default CustomerToolTip;
