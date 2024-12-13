import React from "react";
import { Divider } from "@mui/material";
import DD1KGraphContainer from "../../graph/dd1k/DD1KGraphContainer";
import Dd1kLambdaExceedNewResults from "./Dd1kLambdaExceedNewResults";
import Dd1kLambdaEqualNewResults from "./Dd1kLambdaEqualNewResults";
import Dd1kNewExceedLambdaResults from "./Dd1kNewExceedLambdaResults";
import Dd1k from "@/class/dd1k/Dd1k";

type Dd1kResultsProps = {
  dd1k: Dd1k;
};

const DD1KResults: React.FC<Dd1kResultsProps> = ({ dd1k }) => {
  const { type } = dd1k;
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
    </>
  );
};

export default DD1KResults;
