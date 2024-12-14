import { roundTo4Decimals } from "@/lib/math";
import { QueueSystem } from "../QueueSystem";
import { TimeLineData } from "@/types/Simulation";

type MmStatistics = {
  totalWaitingTime: number;
  averageWaitingTime: number;
  totalWaitingTimeInQueue: number;
  averageWaitingTimeInQueue: number;
  totalIdleServerTime: number;
  averageIdleServerTime: number;
};

function exponentialRandom(rate: number): number {
  return -Math.log(1.0 - Math.random()) / rate;
}

class MM1QueueSimulator extends QueueSystem {
  numOfSimulations: number;

  statistics: MmStatistics;

  constructor(lambda: number, mu: number, numOfSimulations: number) {
    super();
    this.arrivalRate = lambda;
    this.serviceRate = mu;
    this.numOfSimulations = numOfSimulations;

    this.timeLineData = [];
    this.customerLineData = [];
    this.generateSimulationData();
  }

  generateSimulationData() {
    let numInSystem = 0;
    let arrivals = 0;
    let departures = 0;
    let totalWait = 0;
    let clock = 0;
    let nextArrival = 0;
    let nextDeparture = Infinity;
    const queue: number[] = [];
    const timelineMap = new Map<string, TimeLineData>();
    this.customerLineData.push({
      customer: 0,
      arrivalTime: undefined,
      serviceStartTime: undefined,
      departureTime: undefined,
      waitingTime: undefined,
    });

    while (departures < this.numOfSimulations) {
      if (nextArrival <= nextDeparture) {
        // Arrival event
        clock = nextArrival;
        arrivals++;
        numInSystem++;
        const customerIndex = arrivals;

        this.customerLineData[customerIndex] = {
          customer: customerIndex,
          arrivalTime: clock,
          serviceStartTime: numInSystem === 1 ? clock : undefined,
          departureTime: undefined,
          waitingTime: 0,
        };

        if (queue.length === 0) {
          const serviceTime = exponentialRandom(this.serviceRate);
          nextDeparture = clock + serviceTime;
        }
        queue.push(customerIndex);
        nextArrival += exponentialRandom(this.arrivalRate);

        timelineMap.set(clock, {
          time: roundTo4Decimals(clock),
          arrived: true,
          arrivals: arrivals,
          enteredService: numInSystem === 1,
          serviceEnterancs: numInSystem === 1 ? 1 : 0,
          departured: false,
          departures: departures,
          numberOfCustomers: numInSystem,
          key: customerIndex,
        });
      } else {
        // Departure event
        clock = nextDeparture;
        departures++;
        numInSystem--;
        const customerIndex = queue.shift()!;
        const customer = this.customerLineData[customerIndex];
        const waitInSystem = clock - customer.arrivalTime!;
        totalWait += waitInSystem;
        customer.departureTime = clock;
        customer.waitingTime = waitInSystem;

        if (queue.length === 0) {
          nextDeparture = Infinity;
        } else {
          const serviceTime = exponentialRandom(this.serviceRate);
          nextDeparture = clock + serviceTime;
          const nextCustomerIndex = queue[0];
          this.customerLineData[nextCustomerIndex].serviceStartTime = clock;
        }

        timelineMap.set(clock, {
          time: roundTo4Decimals(clock),
          arrived: false,
          arrivals: arrivals,
          enteredService: queue.length > 0,
          serviceEnterancs: queue.length > 0 ? 1 : 0,
          departured: true,
          departures: departures,
          numberOfCustomers: numInSystem,
          key: customerIndex,
        });
      }
    }

    // Convert timelineMap to timeLineData array
    this.timeLineData = Array.from(timelineMap.values()).sort(
      (a, b) => a.time - b.time
    );

    this.statistics = {
      totalWaitingTime: totalWait,
      averageWaitingTime: totalWait / departures,
      totalWaitingTimeInQueue: totalWait - departures / this.serviceRate,
      averageWaitingTimeInQueue:
        (totalWait - departures / this.serviceRate) / departures,
      totalIdleServerTime: clock - totalWait,
      averageIdleServerTime: (clock - totalWait) / this.numOfSimulations,
    };
  }
}

export default MM1QueueSimulator;
