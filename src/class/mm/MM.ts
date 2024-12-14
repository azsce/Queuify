import { roundTo4Decimals } from "@/lib/math";
import { QueueSystem } from "../QueueSystem";

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
    let numArrival = 0;
    let numDeparture = 0;
    let totalWait = 0;
    let waitInSystem = 0;
    let clock = 0;
    let nextArrival = 0;
    let nextDeparture = Infinity;
    const queue: number[] = [];

    this.customerLineData.push({
      customer: 0,
      arrivalTime: undefined,
      serviceStartTime: undefined,
      departureTime: undefined,
      waitingTime: undefined,
    });

    while (numDeparture < this.numOfSimulations) {
      if (nextArrival <= nextDeparture) {
        clock = nextArrival;
        numArrival++;
        numInSystem++;
        const customerIndex = numArrival;

        this.customerLineData.push({
          customer: customerIndex,
          arrivalTime: clock,
          serviceStartTime: numInSystem === 1 ? clock : 0,
          departureTime: 0,
          waitingTime: 0,
        });

        if (queue.length === 0) {
          const serviceTime = exponentialRandom(this.serviceRate);
          nextDeparture = clock + serviceTime;
        }
        queue.push(customerIndex);
        nextArrival += exponentialRandom(this.arrivalRate);

        this.timeLineData.push({
          time: roundTo4Decimals(clock),
          arrived: true,
          arrivals: numArrival,
          enteredService: numInSystem === 1,
          serviceEnterancs: numInSystem === 1 ? 1 : 0,
          departured: false,
          departures: numDeparture,
          numberOfCustomers: numInSystem,
          key: customerIndex,
        });
      } else {
        // Departure event
        clock = nextDeparture;
        numDeparture++;
        numInSystem--;
        const customerIndex = queue.shift()!;
        const customer = this.customerLineData[customerIndex - 1];
        const waitInSystem = clock - customer.arrivalTime;
        totalWait += waitInSystem;
        customer.departureTime = clock;
        customer.waitingTime = waitInSystem;

        if (queue.length === 0) {
          nextDeparture = Infinity;
        } else {
          const serviceTime = exponentialRandom(this.serviceRate);
          nextDeparture = clock + serviceTime;
          const nextCustomerIndex = queue[0];
          this.customerLineData[nextCustomerIndex - 1].serviceStartTime = clock;
        }

        this.timeLineData.push({
          time: roundTo4Decimals(clock),
          arrived: false,
          arrivals: numArrival,
          enteredService: queue.length > 0,
          serviceEnterancs: queue.length > 0 ? 1 : 0,
          departured: true,
          departures: numDeparture,
          numberOfCustomers: numInSystem,
          key: customerIndex,
        });
      }
    }

    this.statistics = {
      totalWaitingTime: totalWait,
      averageWaitingTime: totalWait / numDeparture,
      totalWaitingTimeInQueue: totalWait - numDeparture / this.serviceRate,
      averageWaitingTimeInQueue:
        (totalWait - numDeparture / this.serviceRate) / numDeparture,
      totalIdleServerTime: clock - totalWait,
      averageIdleServerTime: (clock - totalWait) / this.numOfSimulations,
    };
  }
}

export default MM1QueueSimulator;
