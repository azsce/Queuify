"use client";

import React from "react";
import { Box } from "@mui/material";
import ArrivalTimeline from "@/components/graph/ArrivalTimeline";
import ServiceTimeline from "@/components/graph/ServiceTimeline";
import DepartureTimeline from "@/components/graph/DepartureTimeline";
import NumberOfCustomersGraph from "@/components/graph/NumberOfCustomersGraph";
import CustomerFlowDiagram from "@/components/graph/CustomerFlowDiagram";
import WaitingTimeGraph from "@/components/graph/WaitingTimeGraph";
import { QueueSystem } from "@/class/QueueSystem";

type DD1KGraphContainerProps = {
  queueSystem: QueueSystem;
};

const GRAPH_HEIGHT = 300; // Height for each sub-graph

const DD1KGraphContainer: React.FC<DD1KGraphContainerProps> = ({ queueSystem }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          mt: 2,
        }}
      ></Box>

      {/* <CombinedGraph {...props} height={1000} /> Add CombinedGraph */}
      <CustomerFlowDiagram
        queueSystem={queueSystem}
        height={GRAPH_HEIGHT}
        subGraph={true}
        showTopAxis={true}
        showBottomAxis={false}
      />
      <ArrivalTimeline
        queueSystem={queueSystem}
        height={GRAPH_HEIGHT / 2}
        subGraph={true}
        showTopAxis={true}
        showBottomAxis={true}
      />

      <ServiceTimeline
        queueSystem={queueSystem}
        height={GRAPH_HEIGHT / 3}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      />
      <DepartureTimeline
        queueSystem={queueSystem}
        height={GRAPH_HEIGHT / 3}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      />
      <NumberOfCustomersGraph
        queueSystem={queueSystem}
        height={GRAPH_HEIGHT}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      />
      <WaitingTimeGraph
        queueSystem={queueSystem}
        height={GRAPH_HEIGHT}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      />
    </Box>
  );
};

export default DD1KGraphContainer;
