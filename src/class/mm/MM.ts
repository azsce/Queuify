import { CustomerTimeLineData, TimeLineData } from "@/types/Simulation";
import { QueueSystem } from "../QueueSystem";

type MmStatistics = {
  totalWaitingTime: number;
  averageWaitingTime: number;
  totalWaitingTimeInQueue: number;
  averageWaitingTimeInQueue: number;
  totalIdleServerTime: number;
  averageIdleServerTime: number;
};

class MM1QueueSimulator extends QueueSystem {
  numOfSimulations: number;

  timelineData: TimeLineData[] = [];
  customerLineData: CustomerTimeLineData[] = [];
  statistics: MmStatistics;

  constructor(lambda: number, mu: number, numOfSimulations: number) {
    super();
    this.arrivalRate = lambda;
    this.serviceRate = mu;
    this.numOfSimulations = numOfSimulations;
  }

  simulate() {
    let numInSystem = 0;
    let numArrival = 0;
    let numDeparture = 0;
    let totalWait = 0;
    let waitInSystem = 0;
    let clock = 0;
    let nextArrival = 0;
    let nextDeparture = Infinity;
    const queue: number[] = [];

    while (numDeparture < this.numOfSimulations) {
      if (nextArrival <= nextDeparture) {
        clock = nextArrival;
        numArrival++;
        numInSystem++;
        const customerIndex = numArrival;

        this.customerLineData.push({
          customer: customerIndex,
          arrivalTime: clock,
          serviceStartTime: 0,
          departureTime: 0,
          waitingTime: 0,
        });

        if (queue.length === 0) {
          const serviceTime = exponential(this.serviceRate);
          nextDeparture = nextArrival + serviceTime;
          this.customerLineData[customerIndex - 1].serviceStartTime = clock;
        }
        queue.push(customerIndex);
        const interarrivalTime = exponential(this.arrivalRate);
        nextArrival += interarrivalTime;

        this.timelineData.push({
          time: clock,
          arrived: true,
          arrivals: numArrival,
          enteredService: queue.length === 1,
          serviceEnterancs: queue.length === 1 ? 1 : 0,
          departured: false,
          departures: numDeparture,
          numberOfCustomers: numInSystem,
          key: customerIndex,
        });
      } else {
        clock = nextDeparture;
        numDeparture++;
        numInSystem--;
        const customerIndex = queue.shift()!;
        waitInSystem =
          nextDeparture -
          this.customerLineData[customerIndex - 1].arrivalTime;
        totalWait += waitInSystem;
        this.customerLineData[customerIndex - 1].departureTime = clock;

        if (queue.length === 0) {
          nextDeparture = Infinity;
        } else {
          const serviceTime = exponential(this.serviceRate);
          nextDeparture += serviceTime;
          const nextCustomerIndex = queue[0];
          this.customerLineData[nextCustomerIndex - 1].serviceStartTime =
            clock;
        }

        this.timelineData.push({
          time: clock,
          arrived: false,
          arrivals: numArrival,
          enteredService: false,
          serviceEnterancs: 0,
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
      averageWaitingTimeInQueue: (totalWait - numDeparture / this.serviceRate) / numDeparture,
      totalIdleServerTime: clock - totalWait,
      averageIdleServerTime: (clock - totalWait) / this.numOfSimulations,
    };
  }
}

function exponential(rate: number): number {
  return -Math.log(1.0 - Math.random()) / rate;
}

export default MM1QueueSimulator;
