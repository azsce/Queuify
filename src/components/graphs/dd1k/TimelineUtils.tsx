import { Line } from "recharts";
import { DD1KBasicData } from "@/utils/graphDataUtils";
import { colors } from "@/constants";

const t_arrival = "arrival_";
const t_service = "service_";
const t_departure = "departure_";

const renderTimeLines = (
  arrivalTime: number,
  maxTime: number,
  basicData: DD1KBasicData[]
) => {
  let customerArriveIndex = 0;
  let customerServiceIndex = 0;
  let customerDepartureIndex = 0;

  let i = 0;

  const lines = [];
  for (let t = arrivalTime; t <= maxTime; t += arrivalTime) {
    if (basicData[i]?.customerArrives !== "") {
      customerArriveIndex++;
    }
    if (basicData[i]?.customerEnteringService !== "") {
      customerServiceIndex++;
    }

    if (basicData[i]?.customerDeparting !== "") {
      customerDepartureIndex++;
    }

    i++;

    lines.push(
      <Line
        key={`out-${t}`}
        xAxisId={"top"}
        type="monotone"
        dataKey={`${t_arrival}${t}`}
        stroke={colors[customerArriveIndex % colors.length]}
        dot={false}
      />,
      <Line
        key={`system-${t}`}
        xAxisId={"top"}
        type="monotone"
        dataKey={`${t_service}${t}`}
        stroke={colors[customerServiceIndex % colors.length]}
        dot={false}
      />,
      <Line
        key={`service-${t}`}
        xAxisId={"top"}
        type="monotone"
        dataKey={`${t_service}${t}`}
        stroke={colors[customerServiceIndex % colors.length]}
        dot={false}
      />,
      <Line
        key={`departure-${t}`}
        xAxisId={"top"}
        type="monotone"
        dataKey={`${t_departure}${t}`}
        stroke={colors[customerDepartureIndex % colors.length]}
        dot={false}
      />
    );
  }
  return lines;
};

export default renderTimeLines;
