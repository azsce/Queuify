"use client";

import React from "react";
import NumberOfCustomersGraph from "./NumberOfCustomersGraph";

interface DD1KGraphContainerProps {
  width?: number | string;
  height?: number | string;
  arrivalRate?: number;
  serviceRate?: number;
  capacity?: number;
}

const DD1KGraphContainer: React.FC<DD1KGraphContainerProps> = ({
  width = "100%",
  height = 400,
  arrivalRate = 0.25,
  serviceRate = 0.2,
  capacity = 5,
}) => {
  return (
    <div className="space-y-6">
      <NumberOfCustomersGraph
        arrivalRate={arrivalRate}
        serviceRate={serviceRate}
        capacity={capacity}
      />
    </div>
  );
};

export default DD1KGraphContainer;
