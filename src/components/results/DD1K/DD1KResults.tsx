import React from "react";
import { Divider } from "@mui/material";
import DD1KGraphContainer from "../../graphs/dd1k/DD1KGraphContainer";
import { DD1KCharacteristics } from "@/types/dd1k";
import ArrivalBiggerThanservice from "./ArrivalBiggerThanservice";
import ArrivalEqualService from "./ArrivalEqualService";
import ArrivalLessThanService from "./ArrivalLessThanService";

type DD1KResultsProps = {
  characteristics: DD1KCharacteristics;
};

const DD1KResults: React.FC<DD1KResultsProps> = ({ characteristics }) => {
  const { type } = characteristics;
  const result =
    type === "λ = μ" ? (
      <ArrivalEqualService {...characteristics} />
    ) : type === "λ < μ" ? (
      <ArrivalLessThanService {...characteristics} />
    ) : (
      <ArrivalBiggerThanservice {...characteristics} />
    );

  return (
    <>
      {result}
      <Divider />
      {(type === "λ > μ" || type === "(λ > μ) && λ%μ = 0") && (
        <DD1KGraphContainer
          arrivalRate={characteristics.arrivalRate}
          serviceRate={characteristics.serviceRate}
          capacity={characteristics.capacity}
          t_i={characteristics.t_i}
          systemType={characteristics.type}
        />
      )}
    </>
  );
};

export default DD1KResults;
