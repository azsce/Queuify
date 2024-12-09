import React from "react";
import { ColorMap } from "@/constants/graphColors";

interface TooltipData {
  time: string;
  arrivals: number;
  departures: number;
  blocked: number;
  customers: number;
  waitingTime: number;
}

interface PayloadItem {
  value: number;
  name: string;
  dataKey: string;
  payload: TooltipData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
  data: TooltipData[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  data,
}) => {
  if (active && payload?.length) {
    const originalData = data.find((d) => d.time === label);
    return (
      <div className="custom-tooltip">
        <p className="label" color="text.primary">{`Time: ${label}`}</p>
        <p
          className="intro"
          color={ColorMap.arrivals}
        >{`Arrivals: ${originalData.arrivals}`}</p>
        <p
          className="intro"
          color={ColorMap.departures}
        >{`Departures: ${originalData.departures}`}</p>
        <p
          className="intro"
          color={ColorMap.blocked}
        >{`Blocked: ${originalData.blocked}`}</p>
        <p
          className="intro"
          color={ColorMap.customers}
        >{`Customers in the System: ${originalData.customers}`}</p>
        <p
          className="intro"
          color={ColorMap.waitingTime}
        >{`Waiting Time: ${originalData.waitingTime}`}</p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
