import { exponentialRandom, roundTo4Decimals } from "@/lib/math";
import { QueueSystem } from "../QueueSystem";
import { TimeLineData } from "@/types/Simulation";
import { MmStatistics } from "@/types/mm";

class MMCKQueueSimulator extends QueueSystem {
  numOfSimulations: number;
  numOfServers: number;
  capacity: number;
  statistics: MmStatistics;

  constructor(lambda: number, mu: number, numOfSimulations: number, numOfServers: number, capacity: number) {
    super();
    this.arrivalRate = lambda; // Average rate of customer arrivals
    this.serviceRate = mu; // Average rate of service completions
    this.numOfSimulations = numOfSimulations; // Total number of customers to simulate
    this.numOfServers = numOfServers; // Number of servers
    this.capacity = capacity; // Capacity of the system
    this.timeLineData = []; // Stores timeline events for the simulation
    this.customerLineData = []; // Stores data for each customer
    this.generateSimulationData(); // Initiates the simulation
  }

  generateSimulationData() {
    let numInSystem = 0; // Number of customers currently in the system
    let arrivals = 0; // Total number of arrivals
    let departures = 0; // Total number of departures
    let serviceEnterancs = 0; // Total number of customers entered the service
    let blocked = 0; // Total number of blocked customers
    let clock = 0; // Simulation clock
    let nextArrival = 0; // Time of the next arrival
    let nextDepartures: number[] = Array(this.numOfServers).fill(Infinity); // Times of the next departures for each server
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
      const nextDeparture = Math.min(...nextDepartures);
      if (nextArrival <= nextDeparture) {
        // Arrival event
        clock = nextArrival; // Update the clock to the time of the next arrival
        arrivals++; // Increment the number of arrivals

        if (numInSystem < this.capacity) {
          numInSystem++; // Increment the number of customers in the system
          const customerIndex = arrivals;

          const availableServerIndex = nextDepartures.findIndex(time => time === Infinity);
          if (availableServerIndex !== -1) {
            // If there is an available server, schedule the next departure
            const serviceTime = exponentialRandom(this.serviceRate);
            enteredService = true;
            serviceEnterancs++;
            nextDepartures[availableServerIndex] = clock + serviceTime;
          }

          // Record the arrival of the customer
          this.customerLineData[customerIndex] = {
            customer: customerIndex,
            arrivalTime: clock,
            serviceStartTime: enteredService ? clock : undefined,
          };

          customersInSystemList.push(customerIndex); // Add the customer to the queue
        } else {
          blocked++; // Increment the number of blocked customers
        }

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
          blocked: numInSystem >= this.capacity,
          blocks: blocked,
          key: key++,
        });
      } else {
        // Departure event
        clock = nextDeparture;
        departures++;
        numInSystem--;
        const serverIndex = nextDepartures.indexOf(nextDeparture);
        nextDepartures[serverIndex] = Infinity; // Mark the server as available

        // Pull and Remove the customer from the queue
        const customerIndex = customersInSystemList.shift()!;
        const customer = this.customerLineData[customerIndex];
        customer.departureTime = clock; // Record the departure time

        if (customersInSystemList.length > 0) {
          const serviceTime = exponentialRandom(this.serviceRate); // Schedule the next departure
          enteredService = true;
          serviceEnterancs++;
          nextDepartures[serverIndex] = clock + serviceTime;
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
          blocked: false,
          blocks: blocked,
          key: key++,
        });
      }
    }

    // Convert timelineMap to timeLineData array and sort by time
    this.timeLineData = Array.from(timelineMap.values()).sort(
      (a, b) => a.time - b.time
    );

    // Calculate customer waiting times
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

    // Calculate statistics for the simulation
    this.statistics = {
      totalWaitingTime: totalWaitingInSystemTime,
      averageWaitingTime: totalWaitingInSystemTime / departures,
      totalWaitingTimeInQueue: totalWaitingInQueueTime,
      averageWaitingTimeInQueue: totalWaitingInQueueTime / departures,
      totalIdleServerTime: clock - totalWaitingInSystemTime,
      averageIdleServerTime:
        (clock - totalWaitingInSystemTime) / (this.numOfSimulations * this.numOfServers),
      totalBlockedCustomers: blocked,
      blockingProbability: blocked / arrivals,
    };
  }
}

export default MMCKQueueSimulator;
