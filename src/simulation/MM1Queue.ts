/**
 * M/M/1 Queue Simulation Implementation
 * ------------------------------------
 * This class simulates a single-server queuing system with:
 * - Poisson arrival process (M)
 * - Exponential service times (M)
 * - Single server (1)
 *
 * Key Algorithms and Calculations:
 *
 * 1. Interarrival Times:
 *    - Generated using exponential distribution with mean 1/λ
 *    - Formula: -ln(1-U)/λ where U is uniform random number [0,1)
 *
 * 2. Service Times:
 *    - Generated using exponential distribution with mean 1/μ
 *    - Formula: -ln(1-U)/μ where U is uniform random number [0,1)
 *
 * 3. System Performance Metrics:
 *    - Utilization (ρ) = λ/μ
 *    - Average number in system (L) = λ/(μ-λ)
 *    - Average time in system (W) = 1/(μ-λ)
 *    - Average number in queue (Lq) = ρ²/(1-ρ)
 *    - Average waiting time (Wq) = ρ/(μ-λ)
 *
 * Event Handling:
 * 1. Arrival Event:
 *    - Increment system count
 *    - Schedule next arrival
 *    - If server idle, schedule departure
 *    - Record arrival time in queue
 *
 * 2. Departure Event:
 *    - Decrement system count
 *    - Calculate waiting time (departure time - arrival time)
 *    - If queue not empty, schedule next departure
 *
 * @param lambda - Arrival rate (customers per unit time)
 * @param mu - Service rate (customers per unit time)
 */

export class MM1Queue {
  private readonly lambda: number; // arrival rate
  private readonly mu: number; // service rate
  private numInSystem: number = 0;
  private numArrival: number = 0;
  private numDeparture: number = 0;
  private totalWait: number = 0;
  private waitInSystem: number = 0;

  private readonly queue: number[] = []; // arrival times of customers
  private nextArrival: number; // time of next arrival
  private nextDeparture: number; // time of next departure
  private clock: number = 0;

  constructor(lambda: number, mu: number) {
    this.lambda = lambda;
    this.mu = mu;
    this.nextArrival = 0;
    this.nextDeparture = Number.POSITIVE_INFINITY;
  }

  private exponential(mean: number): number {
    return -Math.log(1 - Math.random()) / mean;
  }

  private handleArrivalEvent(): void {
    this.numArrival++;
    this.numInSystem++;
    if (this.queue.length === 0) {
      const serviceTime = this.exponential(this.mu);
      this.nextDeparture = this.nextArrival + serviceTime;
    }
    this.queue.push(this.nextArrival);
    const interarrivalTime = this.exponential(this.lambda);
    this.nextArrival = this.nextArrival + interarrivalTime;
  }

  private handleDepartureEvent(): void {
    this.numDeparture++;
    this.numInSystem--;
    this.waitInSystem = this.nextDeparture - this.queue.shift();
    this.totalWait += this.waitInSystem;
    if (this.queue.length === 0) {
      this.nextDeparture = Number.POSITIVE_INFINITY;
    } else {
      const serviceTime = this.exponential(this.mu);
      this.nextDeparture = this.nextDeparture + serviceTime;
    }
  }

  public simulate(numSimulation: number): void {
    console.log("Serial, Clock, Event, #Arrival, #Departure, #InSystem, Wait");

    for (let i = 1; i < numSimulation; i++) {
      if (this.nextArrival <= this.nextDeparture) {
        this.clock = this.nextArrival;
        this.handleArrivalEvent();
        console.log(
          `${i},${this.clock},Arrival,${this.numArrival},${this.numDeparture},${this.numInSystem},none`
        );
      } else {
        this.clock = this.nextDeparture;
        this.handleDepartureEvent();
        console.log(
          `${i},${this.clock},Departure,${this.numArrival},${this.numDeparture},${this.numInSystem},${this.waitInSystem}`
        );
      }
    }
  }
}

// Example usage:
const lambda = 1; // arrival rate
const mu = 2; // service rate
const numSimulation = 100;

const queue = new MM1Queue(lambda, mu);
queue.simulate(numSimulation);
