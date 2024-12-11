"use client";

import React from "react";
import { Box } from "@mui/material";
import Dd1kArrivalTimeline from "./Dd1kArrivalTimeline";
import Dd1kServiceTimeline from "./Dd1kServiceTimeline";
import Dd1kDepartureTimeline from "./Dd1kDepartureTimeline";
import DD1K from "@/class/dd1k/DD1K";
import Dd1kNumberOfCustomersGraph from "./Dd1kNumberOfCustomersGraph";
import Dd1kCustomerFlowDiagram from "./Dd1kCustomerFlowDiagram";
import Dd1kWaitingTimeGraph from "./Dd1kWaitingTimeGraph";

type DD1KGraphContainerProps = {
  dd1k: DD1K;
};

const GRAPH_HEIGHT = 300; // Height for each sub-graph

const DD1KGraphContainer: React.FC<DD1KGraphContainerProps> = ({ dd1k }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          mt: 2,
        }}
      ></Box>

      {/* <CombinedGraph {...props} height={1000} /> Add CombinedGraph */}
      <Dd1kCustomerFlowDiagram
        dd1k={dd1k}
        height={GRAPH_HEIGHT}
        subGraph={true}
        showTopAxis={true}
        showBottomAxis={false}
      />
      <Dd1kArrivalTimeline
        dd1k={dd1k}
        height={GRAPH_HEIGHT / 2}
        subGraph={true}
        showTopAxis={true}
        showBottomAxis={true}
      />

      <Dd1kServiceTimeline
        dd1k={dd1k}
        height={GRAPH_HEIGHT / 3}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      />
      <Dd1kDepartureTimeline
        dd1k={dd1k}
        height={GRAPH_HEIGHT / 3}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      />
      <Dd1kNumberOfCustomersGraph
        dd1k={dd1k}
        height={GRAPH_HEIGHT}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      />
      <Dd1kWaitingTimeGraph
        dd1k={dd1k}
        height={GRAPH_HEIGHT}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      />
    </Box>
  );
};

export default DD1KGraphContainer;
