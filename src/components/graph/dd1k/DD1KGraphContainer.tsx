"use client";

import React from "react";
import { Box } from "@mui/material";
import Dd1kArrivalTimeline from "./Dd1kArrivalTimeline";
import Dd1kServiceTimeline from "./Dd1kServiceTimeline";
import DD1K from "@/class/dd1k/DD1K";

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
      {/* <CustomerFlowDiagram
        {...props}
        height={GRAPH_HEIGHT}
        subGraph={true}
        showTopAxis={true}
        showBottomAxis={false}
      /> */}
      <Dd1kArrivalTimeline
        dd1k={dd1k}
        height={GRAPH_HEIGHT / 2}
        subGraph={true}
        showTopAxis={true}
        showBottomAxis={true}
      />

      <Dd1kServiceTimeline
        dd1k={dd1k}
        height={GRAPH_HEIGHT / 2}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      />
      {/* <DepartureTimeline
        {...props}
        height={GRAPH_HEIGHT}
        subGraph={true}
        showTopAxis={true}
        showBottomAxis={true}
      /> */}
      {/* <NumberOfCustomersGraph
        {...props}
        height={GRAPH_HEIGHT}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={false}
      /> */}
      {/* <WaitingTimeGraph
        {...props}
        height={GRAPH_HEIGHT}
        subGraph={true}
        showTopAxis={false}
        showBottomAxis={true}
      /> */}
    </Box>
  );
};

export default DD1KGraphContainer;
