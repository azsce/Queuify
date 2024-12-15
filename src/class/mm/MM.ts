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
    let totalWait = 0; // Total waiting time for all customers
    let clock = 0; // Simulation clock
    let nextArrival = 0; // Time of the next arrival
    let nextDeparture = Infinity; // Time of the next departure
    const customersInSystemList: number[] = []; // Queue of customers in system
    const timelineMap = new Map<number, TimeLineData>(); // Map to store timeline events

    let key = 0; // Unique key for rendering the timeline

    // Initialize the first customer data
    this.customerLineData.push({
      customer: 0,
      arrivalTime: undefined,
      serviceStartTime: undefined,
      departureTime: undefined,
      waitingTime: undefined,
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

        // Record the arrival of the customer
        this.customerLineData[customerIndex] = {
          customer: customerIndex,
          arrivalTime: clock,
          serviceStartTime: numInSystem === 1 ? clock : undefined,
          departureTime: undefined,
          waitingTime: 0,
        };

        if (customersInSystemList.length === 0) {
          // If the queue is empty, schedule the next departure
          const serviceTime = exponentialRandom(this.serviceRate);
          enteredService = true;
          serviceEnterancs++;
          nextDeparture = clock + serviceTime;
        }

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
        clock = nextDeparture; // Update the clock to the time of the next departure
        departures++; // Increment the number of departures
        numInSystem--; // Decrement the number of customers in the system
        const customerIndex = customersInSystemList.shift()!; // Remove the customer from the queue
        const customer = this.customerLineData[customerIndex];
        const waitInSystem = clock - customer.arrivalTime!; // Calculate the waiting time in the system
        totalWait += waitInSystem; // Add to the total waiting time
        customer.departureTime = clock; // Record the departure time
        customer.waitingTime = waitInSystem; // Record the waiting time

        if (customersInSystemList.length === 0) {
          nextDeparture = Infinity; // If the queue is empty, set the next departure to infinity
        } else {
          const serviceTime = exponentialRandom(this.serviceRate); // Schedule the next departure
          enteredService = true;
          serviceEnterancs++;
          nextDeparture = clock + serviceTime;
          const nextCustomerIndex = customersInSystemList[0];
          this.customerLineData[nextCustomerIndex].serviceStartTime = clock; // Record the service start time for the next customer
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

    this.customerLineData.push({
      customer: this.numOfSimulations + 2,
      arrivalTime: undefined,
      serviceStartTime: undefined,
      departureTime: undefined,
      waitingTime: undefined,
    });

    // Convert timelineMap to timeLineData array and sort by time
    this.timeLineData = Array.from(timelineMap.values()).sort(
      (a, b) => a.time - b.time
    );

    // Calculate statistics for the simulation
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
