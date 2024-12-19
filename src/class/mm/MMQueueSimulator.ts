import { exponentialRandom, roundTo4Decimals } from "@/lib/math";
import { QueueSystem } from "../QueueSystem";
import { TimeLineData } from "@/types/Simulation";
import { MmStatistics } from "@/types/mm";
import Customer from "./Customer";
import Server from "./Server";
import EventQueue, { Event } from "./EventQueue";

export type MmSimulatorParams = {
  servers: number;
  capacity: number;
  arrivalRate: number;
  serviceRate: number;
  numOfSimulations: number;
};

class MMQueueSimulator extends QueueSystem {
  numOfSimulations: number;
  numOfServers: number;
  capacity: number;
  statistics: MmStatistics;
  servers: Server[];
  customersInSystemList: Customer[];
  allCustomers: Customer[];
  timelineMap: Map<number, TimeLineData>;
  arrivals: number;
  departures: number;
  serviceEnterancs: number;
  blocked: number;
  key: number;
  clock: number;
  eventQueue: EventQueue;

  constructor({
    servers,
    capacity,
    arrivalRate,
    serviceRate,
    numOfSimulations,
  }: MmSimulatorParams) {
    super();
    this.arrivalRate = arrivalRate; // Average rate of customer arrivals
    this.serviceRate = serviceRate; // Average rate of service completions
    this.numOfSimulations = numOfSimulations; // Total number of customers to simulate
    this.numOfServers = servers; // Number of servers
    this.capacity = capacity; // Capacity of the system
    this.timeLineData = []; // Stores timeline events for the simulation
    this.customerLineData = []; // Stores data for each customer
    this.servers = Array.from(
      { length: servers },
      (_, i) => new Server(i)
    ); // Initialize servers
    this.customersInSystemList = []; // Queue of customers in system
    this.allCustomers = []; // List of all customers
    this.timelineMap = new Map<number, TimeLineData>(); // Map to store timeline events
    this.arrivals = 0;
    this.departures = 0;
    this.serviceEnterancs = 0;
    this.blocked = 0;
    this.key = 0;
    this.clock = 0;
    this.eventQueue = new EventQueue();

    this.simulate();
  }

  async simulate() {
    this.scheduleNextArrival(0);
    while (this.arrivals < this.numOfSimulations || this.customersInSystemList.length > 0 || this.servers.some(server => !server.isIdle)) {
      const event = this.eventQueue.getNextEvent();
      if (event) {
        this.clock = event.time;
        if (event.type === "arrival") {
          this.handleArrival(event.customer!);
        } else if (event.type === "departure") {
          this.handleDeparture(event.server!);
        }
        this.updateTimelineData(event);
      }
    }
    this.generateSimulationData();
  }

  updateTimelineData(event: Event) {
    const time = event.time;
    if (!this.timelineMap.has(time)) {
      this.timelineMap.set(time, {
        time: time,
        arrived: false,
        arrivals: 0,
        arrivalCustomers: new Set<number>(),
        blocked: null,
        blocks: 0,
        enteredService: false,
        serviceEnterancs: 0,
        serviceCustomers: new Set<number>(),
        departured: false,
        departures: 0,
        departureCustomers: new Set<number>(),
        numberOfCustomers: 0,
        key: this.key++,
      });
    }

    const timelineData = this.timelineMap.get(time)!;

    if (event.type === "arrival") {
      timelineData.arrived = true;
      timelineData.arrivals++;
      timelineData.arrivalCustomers.add(event.customer!.id);
      if (event.customer!.blocked) {
        timelineData.blocked = true;
        timelineData.blocks++;
      }
    } else if (event.type === "departure") {
      timelineData.departured = true;
      timelineData.departures++;
      if (event.server!.currentCustomer) {
        timelineData.departureCustomers.add(event.server!.currentCustomer.id);
      }
    }

    timelineData.numberOfCustomers = this.customersInSystemList.length;
  }

  scheduleNextArrival(currentTime: number) {
    if (this.arrivals < this.numOfSimulations) {
      const nextArrivalTime = currentTime + exponentialRandom(this.arrivalRate);
      const customer = new Customer(this.arrivals + 1, nextArrivalTime, false);
      this.eventQueue.addEvent({ time: nextArrivalTime, type: "arrival", customer });
    }
  }

  handleArrival(customer: Customer) {
    this.arrivals++;
    console.log(`Customer ${customer.id} arrived at ${customer.arrivalTime}`);
    this.allCustomers.push(customer);

    if (this.customersInSystemList.length < this.capacity) {
      // Customer can enter the system
      this.customersInSystemList.push(customer); // Add the customer to the queue
      this.tryToServeNextCustomer();
    } else {
      // Customer is blocked
      customer.blocked = true;
      this.blocked++; // Increment the number of blocked customers
      console.log(`Customer ${customer.id} is blocked at ${customer.arrivalTime}`);
    }

    this.scheduleNextArrival(customer.arrivalTime);
  }

  handleDeparture(server: Server) {
    // Handle server service completion
    if (server.currentCustomer) {
      const customer = server.currentCustomer;
      this.customersInSystemList = this.customersInSystemList.filter(
        (c) => c.id !== customer.id
      );
      this.departures++; // Increment the number of departures
      console.log(`Customer ${customer.id} departed at ${server.finishTime} from server ${server.id}`);
      server.finishService();
    }

    this.tryToServeNextCustomer();
  }

  tryToServeNextCustomer() {
    const availableServer = this.servers.find((server) => server.isIdle);
    if (availableServer && this.customersInSystemList.length > 0) {
      const customer = this.customersInSystemList.shift(); // Remove the customer from the queue
      if (customer) {
        const serviceTime = availableServer.serveCustomer(this.clock, this.serviceRate, customer); // Schedule the next departure
        this.serviceEnterancs++; // Increment the number of customers entered the service
        console.log(`Customer ${customer.id} started service at ${this.clock} on server ${availableServer.id} for ${serviceTime} time units`);
        this.eventQueue.addEvent({ time: this.clock + serviceTime, type: "departure", server: availableServer });
        this.updateServiceTimelineData(this.clock, customer.id);
      }
    }
  }

  updateServiceTimelineData(time: number, customerId: number) {
    if (!this.timelineMap.has(time)) {
      this.timelineMap.set(time, {
        time: time,
        arrived: false,
        arrivals: 0,
        arrivalCustomers: new Set<number>(),
        blocked: null,
        blocks: 0,
        enteredService: false,
        serviceEnterancs: 0,
        serviceCustomers: new Set<number>(),
        departured: false,
        departures: 0,
        departureCustomers: new Set<number>(),
        numberOfCustomers: 0,
        key: this.key++,
      });
    }

    const timelineData = this.timelineMap.get(time)!;
    timelineData.enteredService = true;
    timelineData.serviceEnterancs++;
    timelineData.serviceCustomers.add(customerId);
  }

  generateSimulationData() {
    // Convert timelineMap to timeLineData array and sort by time
    this.timeLineData = Array.from(this.timelineMap.values()).sort(
      (a, b) => a.time - b.time
    );

    // Calculate customer waiting times
    let totalWaitingInSystemTime = 0; // Total waiting time for all customers
    let totalWaitingInQueueTime = 0; // Total waiting time in queue for all customers
    this.allCustomers.forEach((customer) => {
      const { arrivalTime, serviceStartTime, departureTime, blocked } = customer;

      // Skip validation for blocked customers
      if (blocked) {
        return;
      }

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

        // Assert that calculated waiting times are non-negative
        console.assert(
          wq >= 0,
          `Waiting in queue time should be non-negative for customer ${customer.id}`
        );
        console.assert(
          w >= 0,
          `Waiting in system time should be non-negative for customer ${customer.id}`
        );
        // Assert that waiting times are correctly calculated
        console.assert(
          customer.waitingInQueueTime === serviceStartTime - arrivalTime,
          `Waiting in queue time should be service start time minus arrival time for customer ${customer.id}`
        );
        console.assert(
          customer.waitingInSystemTime === departureTime - arrivalTime,
          `Waiting in system time should be departure time minus arrival time for customer ${customer.id}`
        );
      } else {
        console.error("Invalid data for customer:", customer);
      }
    });

    // Assert that the total number of arrivals equals the sum of departures and blocked customers
    console.assert(
      this.arrivals === this.departures + this.blocked,
      "Mismatch in arrivals, departures, and blocked customers"
    );

    // Calculate total idle server time
    const totalIdleServerTime = this.servers.reduce(
      (sum, server) => sum + server.totalIdleTime,
      0
    );

    // Calculate statistics for the simulation
    this.statistics = {
      totalWaitingTime: totalWaitingInSystemTime,
      averageWaitingTime: this.departures > 0 ? totalWaitingInSystemTime / this.departures : 0,
      totalWaitingTimeInQueue: totalWaitingInQueueTime,
      averageWaitingTimeInQueue: this.departures > 0 ? totalWaitingInQueueTime / this.departures : 0,
      totalIdleServerTime: totalIdleServerTime,
      averageIdleServerTime: this.numOfServers > 0 ? totalIdleServerTime / this.numOfServers : 0,
      totalBlockedCustomers: this.blocked,
      blockingProbability: this.arrivals > 0 ? this.blocked / this.arrivals : 0,
    };

    // Validate calculated statistics before asserting
    if (this.statistics.averageWaitingTime < 0) {
      console.error(
        "Invalid average waiting time:",
        this.statistics.averageWaitingTime
      );
    }
    if (this.statistics.averageWaitingTimeInQueue < 0) {
      console.error(
        "Invalid average waiting time in queue:",
        this.statistics.averageWaitingTimeInQueue
      );
    }
    if (this.statistics.averageIdleServerTime < 0) {
      console.error(
        "Invalid average idle server time:",
        this.statistics.averageIdleServerTime
      );
    }
    if (
      this.statistics.blockingProbability < 0 ||
      this.statistics.blockingProbability > 1
    ) {
      console.error(
        "Invalid blocking probability:",
        this.statistics.blockingProbability
      );
    }

    // Assert that the calculated statistics are valid
    // console.assert(this.statistics.averageWaitingTime >= 0, "Average waiting time should be non-negative");
    // console.assert(this.statistics.averageWaitingTimeInQueue >= 0, "Average waiting time in queue should be non-negative");
    // console.assert(this.statistics.averageIdleServerTime >= 0, "Average idle server time should be non-negative");
    // console.assert(this.statistics.blockingProbability >= 0 && this.statistics.blockingProbability <= 1, "Blocking probability should be between 0 and 1");
  }
}

export default MMQueueSimulator;
