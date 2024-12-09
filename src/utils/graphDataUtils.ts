import DD1K from "@/lib/dd1k";
import { DD1KType } from "@/types/dd1k";

interface BasicData {
  time: string;
  customer: string;
  arrivals: number;
  departures: number;
  blocked: number;
  customers: number;
  waitingTime: number;
  service: number | null;
  departure: number | null;
  customerIndex: string;
}

export const generateBasicData = (
  maxTime: number,
  arrivalRate: number,
  serviceRate: number,
  capacity: number,
  t_i: number,
  systemType: DD1KType
): BasicData[] => {
  const data = [];
  const timeStep = 1 / arrivalRate;
  const serviceTime = 1 / serviceRate;
  const firstServiceTime = 1 / arrivalRate;
  const firstDepartureTime = 1 / arrivalRate + serviceTime;
  let totalBlocked = 0;
  let currentCustomer = 1;

  for (let t = 0; t <= maxTime; t += timeStep) {
    const arrivals = Math.floor(t * arrivalRate);
    const departures = Math.floor(t * serviceRate);
    const isBlocked = DD1K.isCustomerBlocked(
      t,
      arrivalRate,
      serviceRate,
      capacity,
      t_i,
      systemType
    );

    if (isBlocked) {
      totalBlocked++;
    }

    const customers = DD1K.computeNOfT(
      t,
      arrivalRate,
      serviceRate,
      t_i,
      capacity,
      systemType
    );

    const waitingTime = DD1K.computeWqOfN(
      customers,
      arrivalRate,
      serviceRate,
      t_i,
      systemType
    );

    const customerNumber = Math.floor(t * arrivalRate) + 1;

    data.push({
      time: Math.round(t).toString(),
      customer: customerNumber.toString(),
      arrivals,
      departures,
      blocked: totalBlocked,
      customers,
      waitingTime,
      service:
        t >= firstServiceTime && (t - firstServiceTime) % serviceTime < timeStep
          ? currentCustomer
          : null,
      departure:
        t >= firstDepartureTime &&
        (t - firstDepartureTime) % serviceTime < timeStep
          ? currentCustomer++
          : null,
      customerIndex: `C${currentCustomer}`,
    });
  }
  return data;
};

export const calculateSectionHeights = (basicData: BasicData[]) => {
  const maxValues = {
    metrics: Math.max(
      ...basicData.map((d) => Math.max(d.arrivals, d.departures, d.blocked))
    ),
    customers: Math.max(...basicData.map((d) => d.customers)),
    waitingTime: Math.max(...basicData.map((d) => d.waitingTime)),
    timeline: 0.5,
  };

  const maxSectionValue = Math.max(...Object.values(maxValues));
  const sectionHeight = maxSectionValue;
  const sectionSpacing = sectionHeight * 0.25;

  return { maxValues, sectionHeight, sectionSpacing };
};
