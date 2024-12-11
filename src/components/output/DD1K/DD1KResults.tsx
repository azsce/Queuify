import React from "react";
import { Divider } from "@mui/material";
import DD1KGraphContainer from "../../graph/dd1k/DD1KGraphContainer";
import Dd1kλExceedμResults from "./Dd1kλExceedμResults";
import Dd1kλEqualμResults from "./Dd1kλEqualμResults";
import Dd1kμExceedλlResults from "./ArrivalLessThanService";
import DD1K from "@/class/dd1k/DD1K";

type Dd1kResultsProps = {
  dd1k: DD1K;
};

const DD1KResults: React.FC<Dd1kResultsProps> = ({ dd1k }) => {
  const { type } = dd1k;
  let result: React.JSX.Element = null;
  if (type === "λ = μ") {
    result = <Dd1kλEqualμResults dd1k={dd1k} />;
  } else if (type === "λ < μ") {
    result = <Dd1kμExceedλlResults dd1k={dd1k} />;
  } else {
    result = <Dd1kλExceedμResults dd1k={dd1k} />;
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
