"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface NumberOfCustomersGraphProps {
  arrivalRate: number;
  serviceRate: number;
  capacity: number;
}

const NumberOfCustomersGraph: React.FC<NumberOfCustomersGraphProps> = ({
  arrivalRate,
  serviceRate,
  capacity,
}) => {
  const generateData = () => {
    const data = [];
    const maxTime = 50;
    const timeStep = 0.5;

    for (let t = 0; t <= maxTime; t += timeStep) {
      const arrivals = Math.floor(arrivalRate * t);
      const departures = Math.floor(
        serviceRate * t - serviceRate / arrivalRate
      );
      let customers = Math.max(0, arrivals - departures);
      customers = Math.min(customers, capacity);

      data.push({
        time: t,
        customers: customers,
      });
    }
    return data;
  };

  const data = generateData();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Number of Customers vs Time</h3>
      <div className="w-full h-[500px] rounded-lg border bg-card p-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 90, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              label={{
                value: "Time (t)",
                position: "insideBottom",
                offset: -10,
                dy: 10,
              }}
            />
            <YAxis
              label={{
                value: "Number of Customers n(t)",
                angle: -90,
                position: "insideLeft",
                dx: -20,
                dy: 90,
              }}
              allowDecimals={false}
              domain={[0, capacity]}
            />
            <Tooltip />
            <Line
              type="stepAfter"
              dataKey="customers"
              stroke="#8884d8"
              name="Customers in System"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NumberOfCustomersGraph;
