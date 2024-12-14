import React from "react";
import { Box, Divider } from "@mui/material";
import DD1KGraphContainer from "../../graph/dd1k/Dd1kGraphContainer";
import Dd1kLambdaExceedNewResults from "./Dd1kLambdaExceedNewResults";
import Dd1kLambdaEqualNewResults from "./Dd1kLambdaEqualNewResults";
import Dd1kNewExceedLambdaResults from "./Dd1kNewExceedLambdaResults";
import Dd1k from "@/class/dd1k/Dd1k";

type Dd1kResultsProps = {
  dd1k: Dd1k;
};

const DD1KResults: React.FC<Dd1kResultsProps> = ({ dd1k }) => {
  const { dd1kType: type } = dd1k;
  let result: React.JSX.Element = null;
  if (type === "λ = μ") {
    result = <Dd1kLambdaEqualNewResults dd1k={dd1k} />;
  } else if (type === "λ < μ") {
    result = <Dd1kNewExceedLambdaResults dd1k={dd1k} />;
  } else {
    result = <Dd1kLambdaExceedNewResults dd1k={dd1k} />;
  }

  return (
    <>
      {result}
      <Divider />

      <DD1KGraphContainer dd1k={dd1k} />
      <Box sx={{ height: "30vh" }} />

    </>
  );
};

export default DD1KResults;
