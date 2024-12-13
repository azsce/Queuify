import { Box, Typography, useTheme } from "@mui/material";
import React from "react"
import { TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

import {
  roundTo4Decimals,
} from "@/lib/math";

type ThemedToolTipProps = TooltipProps<ValueType, NameType> & {
    labelKey: string
}

const ThemedToolTip: React.FC<ThemedToolTipProps> = ({ 
    active, 
    payload, 
    label,
    labelKey,
  }) => {
    const theme = useTheme();
    
  
    if (active && payload && payload.length) {
      return (
        <Box 
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
            p: 1,
            boxShadow: theme.shadows[1]
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {labelKey}: {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={`item-${index}`} 
              variant="body2"
              sx={{ 
                color: entry.color,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box 
                sx={{ 
                  width: 10, 
                  height: 10, 
                  backgroundColor: entry.color,
                  borderRadius: '50%',
                  display: 'inline-block',
                  mr: 1 
                }} 
              />
              {entry.name}: {roundTo4Decimals(entry.value)}
            </Typography>
          ))}
        </Box>
      );
    }
  
    return null;
  };
  
  export default ThemedToolTip;