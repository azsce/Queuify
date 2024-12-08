"use client";

import React from "react";
import NumberOfCustomersGraph from "./NumberOfCustomersGraph";
import { DD1KType } from "@/types/dd1k";

interface DD1KGraphContainerProps {
  width?: number | string;
  height?: number | string;
  arrivalRate: number;
  serviceRate: number;
  capacity: number;
  t_i: number;
  systemType: DD1KType;
}

const DD1KGraphContainer: React.FC<DD1KGraphContainerProps> = ({
  width = "100%",
  height = 400,
  arrivalRate,
  serviceRate,
  capacity,
  t_i,
  systemType,
}) => {
  return (
    <div className="space-y-6">
      <NumberOfCustomersGraph
        arrivalRate={arrivalRate}
        serviceRate={serviceRate}
        capacity={capacity}
        t_i={t_i}
        systemType={systemType}
      />
    </div>
  );
};

export default DD1KGraphContainer;
