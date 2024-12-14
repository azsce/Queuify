"use client";

import React from "react";
import { Box } from "@mui/material";
import ArrivalTimeline from "../ArrivalTimeline";
import ServiceTimeline from "../ServiceTimeline";
import DepartureTimeline from "../DepartureTimeline";
import Dd1k from "@/class/dd1k/Dd1k";
import NumberOfCustomersGraph from "../NumberOfCustomersGraph";
import CustomerFlowDiagram from "../CustomerFlowDiagram";
import WaitingTimeGraph from "../WaitingTimeGraph";

type DD1KGraphContainerProps = {
  dd1k: Dd1k;
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
      <CustomerFlowDiagram
        dd1k={dd1k}
        height={GRAPH_HEIGHT}
        subGraph={true}
        showTopAxis={true}
        showBottomAxis={false}
      />
      <ArrivalTimeline
        dd1k={dd1k}
        height={GRAPH_HEIGHT / 2}
        subGraph={true}
        showTopAxis={true}
        showBottomAxis={true}
      />

      <ServiceTimeline
        dd1k={dd1k}
        height={GRAPH_HEIGHT / 3}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      />
      <DepartureTimeline
        dd1k={dd1k}
        height={GRAPH_HEIGHT / 3}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      />
      <NumberOfCustomersGraph
        dd1k={dd1k}
        height={GRAPH_HEIGHT}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      />
      <WaitingTimeGraph
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
