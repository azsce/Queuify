import { exponentialRandom, roundTo4Decimals } from "@/lib/math";
import { QueueSystem } from "../QueueSystem";
import { TimeLineData } from "@/types/Simulation";
import { MmStatistics } from "@/types/mm";

class MM1QueueSimulator extends QueueSystem {
  numOfSimulations: number;
  statistics: MmStatistics;

  constructor(lambda: number, mu: number, numOfSimulations: number) {
    super();
    this.arrivalRate = lambda; // Average rate of customer arrivals
    this.serviceRate = mu; // Average rate of service completions
    this.numOfSimulations = numOfSimulations; // Total number of customers to simulate
    this.timeLineData = []; // Stores timeline events for the simulation
    this.customerLineData = []; // Stores data for each customer
    this.generateSimulationData(); // Initiates the simulation
  }

  generateSimulationData() {
    let numInSystem = 0; // Number of customers currently in the system
    let arrivals = 0; // Total number of arrivals
    let departures = 0; // Total number of departures
    let serviceEnterancs = 0; // Total number of customers entered the service
    let clock = 0; // Simulation clock
    let nextArrival = 0; // Time of the next arrival
    let nextDeparture = Infinity; // Time of the next departure
    const customersInSystemList: number[] = []; // Queue of customers in system
    const timelineMap = new Map<number, TimeLineData>(); // Map to store timeline events

    let key = 0; // Unique key for rendering the timeline

    // Initialize the first customer data
    this.customerLineData.push({
      customer: 0,
    });

    // Run the simulation until the desired number of departures is reached
    while (departures < this.numOfSimulations) {
      let enteredService = false;
      if (nextArrival <= nextDeparture) {
        // Arrival event
        clock = nextArrival; // UpdatcustomerIndexe the clock to the time of the next arrival
        arrivals++; // Increment the number of arrivals
        numInSystem++; // Increment the number of customers in the system
        const customerIndex = arrivals;

        if (customersInSystemList.length === 0) {
          // If the queue is empty, schedule the next departure
          const serviceTime = exponentialRandom(this.serviceRate);
          enteredService = true;
          serviceEnterancs++;
          nextDeparture = clock + serviceTime;
        }

        // Record the arrival of the customer
        this.customerLineData[customerIndex] = {
          customer: customerIndex,
          arrivalTime: clock,
          serviceStartTime: enteredService ? clock : undefined,
        };

        customersInSystemList.push(customerIndex); // Add the customer to the queue
        nextArrival += exponentialRandom(this.arrivalRate); // Schedule the next arrival

        // Record the event in the timeline
        timelineMap.set(clock, {
          time: roundTo4Decimals(clock),
          arrived: true,
          arrivals: arrivals,
          enteredService: enteredService,
          serviceEnterancs: serviceEnterancs,
          departured: false,
          departures: departures,
          numberOfCustomers: numInSystem,
          key: key++,
        });
      } else {
        // Departure event
        clock = nextDeparture;
        departures++;
        numInSystem--;
        // Pull and Remove the customer from the queue
        const customerIndex = customersInSystemList.shift()!;
        const customer = this.customerLineData[customerIndex];
        customer.departureTime = clock; // Record the departure time

        if (customersInSystemList.length === 0) {
          nextDeparture = Infinity; // If the queue is empty, set the next departure to infinity
        } else {
          const serviceTime = exponentialRandom(this.serviceRate); // Schedule the next departure
          enteredService = true;
          serviceEnterancs++;
          nextDeparture = clock + serviceTime;
          const nextCustomerIndex = customersInSystemList[0];
          this.customerLineData[nextCustomerIndex].serviceStartTime = clock;
        }

        // Record the event in the timeline
        timelineMap.set(clock, {
          time: roundTo4Decimals(clock),
          arrived: false,
          arrivals: arrivals,
          enteredService: enteredService,
          serviceEnterancs: serviceEnterancs,
          departured: true,
          departures: departures,
          numberOfCustomers: numInSystem,
          key: key++,
        });
      }
    }

    // Convert timelineMap to timeLineData array and sort by time
    this.timeLineData = Array.from(timelineMap.values()).sort(
      (a, b) => a.time - b.time
    );

    //calculate cusomter.waintingInQueue for each customer
    let totalWaitingInSystemTime = 0; // Total waiting time for all customers
    let totalWaitingInQueueTime = 0; // Total waiting time in queue for all customers
    this.customerLineData.forEach((customer) => {
      const { arrivalTime, serviceStartTime, departureTime } = customer;

      // Validate times to ensure they are numbers
      if (
        typeof arrivalTime === "number" &&
        typeof serviceStartTime === "number" &&
        typeof departureTime === "number"
      ) {
        const wq = serviceStartTime - arrivalTime;
        customer.waitingInQueueTime = wq;
        totalWaitingInQueueTime += wq;

        const w = departureTime - arrivalTime;
        customer.waitingInSystemTime = w;
        totalWaitingInSystemTime += w;
      } else {
        console.error("Invalid data for customer:", customer);
      }
    });
    console.log("Total waiting time in system:", totalWaitingInSystemTime);

    // Calculate statistics for the simulation
    this.statistics = {
      totalWaitingTime: totalWaitingInSystemTime,
      averageWaitingTime: totalWaitingInSystemTime / departures,
      totalWaitingTimeInQueue: totalWaitingInQueueTime,
      averageWaitingTimeInQueue: totalWaitingInQueueTime / departures,
      totalIdleServerTime: clock - totalWaitingInSystemTime,
      averageIdleServerTime:
        (clock - totalWaitingInSystemTime) / this.numOfSimulations,
    };
  }
}

export default MM1QueueSimulator;
