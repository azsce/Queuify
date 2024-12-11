/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DD1KλExceedμ } from "@/class/dd1k/dd1k";
import { DD1KType } from "@/types/dd1k";

export interface DD1KBasicData {
  time: number;
  customer: string;
  arrivals: number;
  departures: number;
  blocked: number;
  customers: number;
  waitingTime: number;
  customerArrives: string;
  customerEnteringService: string;
  customerDeparting: string;
  customerIndex: string;
}
export namespace DD1KμExceedλGraphUtils {
  export const generateBasicData = (
    maxTime: number,
    arrivalRate: number,
    serviceRate: number,
    capacity: number,
    t_i: number,
    systemType: DD1KType
  ): DD1KBasicData[] => {
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
      const isBlocked = DD1KλExceedμ.isCustomerBlocked(
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

      const customers = DD1KλExceedμ.computeNOfT(
        t,
        arrivalRate,
        serviceRate,
        t_i,
        capacity,
        systemType
      );

      const waitingTime = DD1KλExceedμ.computeWqOfN(
        customers,
        arrivalRate,
        serviceRate,
        t_i,
        systemType
      );

      const customerNumber = Math.floor(t * arrivalRate) + 1;

      data.push({
        time: t,
        customer: customerNumber.toString(),
        arrivals,
        departures,
        blocked: totalBlocked,
        customers,
        waitingTime,
        customerArrives: t > 0 ? `C${customerNumber}` : "",
        customerEnteringService:
          t >= firstServiceTime &&
          (t - firstServiceTime) % serviceTime < timeStep
            ? `C${currentCustomer}`
            : "",
        customerDeparting:
          t >= firstDepartureTime &&
          (t - firstDepartureTime) % serviceTime < timeStep
            ? `C${currentCustomer++}`
            : "",
        customerIndex: `C${currentCustomer}`,
      });
    }
    return data;
  };

  export const adjustBasicData = (
    basicData: DD1KBasicData[],
    scaleFactors: Record<keyof SectionOffsets, number>,
    yAxisOffsets: SectionOffsets
  ) => {
    return basicData.map((entry) => ({
      ...entry,
      waitingTime:
        entry.waitingTime * scaleFactors.waitingTime + yAxisOffsets.waitingTime,
      customers:
        entry.customers * scaleFactors.customers + yAxisOffsets.customers,
      arrivals:
        entry.arrivals * scaleFactors.customerFlow + yAxisOffsets.customerFlow,
      departures:
        entry.departures * scaleFactors.customerFlow +
        yAxisOffsets.customerFlow,
      blocked:
        entry.blocked * scaleFactors.customerFlow + yAxisOffsets.customerFlow,
    }));
  };

  interface SectionOffsets {
    customers: number;
    customerFlow: number;
    waitingTime: number;
  }

  interface SectionHeightsResult {
    maxValues: {
      waitingTime: number;
      customers: number;
      customerFlow: number;
    };
    sectionHeight: number;
    sectionSpacing: number;
    scaleFactors: {
      waitingTime: number;
      customers: number;
      customerFlow: number;
    };
    yAxisOffsets: SectionOffsets;
    totalHeight: number;
  }

  // Export the sections type and definition
  export const sections: Record<keyof SectionOffsets, number> = {
    waitingTime: 0,
    customers: 4,
    customerFlow: 5,
  };

  export const calculateSectionHeights = (
    basicData: DD1KBasicData[],
    containerHeight: number
  ): SectionHeightsResult => {
    // Calculate max values for each section
    const maxValues = {
      waitingTime: Math.max(...basicData.map((d) => d.waitingTime)),
      customers: Math.max(...basicData.map((d) => d.customers)),
      customerFlow: Math.max(
        ...basicData.map((d) => Math.max(d.arrivals, d.departures, d.blocked))
      ),
    };

    // Use the exported sections constant
    const numSections = Object.keys(sections).length;
    const sectionSpacingRatio = 0.2; // 20% of section height

    // Calculate base section height accounting for spacing
    const sectionHeight =
      containerHeight / (numSections + (numSections - 1) * sectionSpacingRatio);
    const sectionSpacing = sectionHeight * sectionSpacingRatio;

    // Calculate scale factors for each section
    const scaleFactors = {
      waitingTime: sectionHeight / (maxValues.waitingTime || 1),
      customers: sectionHeight / (maxValues.customers || 1),
      customerFlow: sectionHeight / (maxValues.customerFlow || 1),
    };

    // Update the yAxisOffsets calculation to ensure typed result
    const yAxisOffsets = Object.entries(sections).reduce(
      (acc, [key, sectionIndex]) => ({
        ...acc,
        [key]: sectionIndex * (sectionHeight + sectionSpacing),
      }),
      {} as SectionOffsets
    );

    return {
      maxValues,
      sectionHeight,
      sectionSpacing,
      scaleFactors,
      yAxisOffsets,
      totalHeight:
        (numSections - 1) * (sectionHeight + sectionSpacing) + sectionHeight,
    };
  };

  const t_arrival = "arrival_";
  const t_service = "service_";
  const t_departure = "departure_";

  export const generateTimeLineData = (basicData: DD1KBasicData[]) => {
    const enterMap: { [key: string]: any } = {};
    const gap1Map: { [key: string]: any } = {};
    const systemMap: { [key: string]: any } = {};
    const gap2Map: { [key: string]: any } = {};
    const serviceMap: { [key: string]: any } = {};
    const gap3Map: { [key: string]: any } = {};
    const departureMap: { [key: string]: any } = {};
    const exitMap: { [key: string]: any } = {};

    enterMap["state"] = "";
    gap1Map["state"] = "";
    systemMap["state"] = "SYS";
    gap2Map["state"] = "";
    serviceMap["state"] = "SRV";
    gap3Map["state"] = "";
    departureMap["state"] = "DEP";
    exitMap["state"] = "";

    for (const data of basicData) {
      if (data.customerArrives !== "") {
        const arrival = t_arrival + data.time;
        enterMap[arrival] = data.time;
        systemMap[arrival] = data.time;
      }

      if (data.customerEnteringService !== "") {
        const service = t_service + data.time;
        systemMap[service] = data.time;
        serviceMap[service] = data.time;
      }

      if (data.customerDeparting !== "") {
        const departure = t_departure + data.time;
        serviceMap[departure] = data.time;
        departureMap[departure] = data.time;
      }
    }

    return [
      enterMap,
      systemMap,
      // gap2Map,
      serviceMap,
      // gap3Map,
      departureMap,
      exitMap,
    ];
  };
}
