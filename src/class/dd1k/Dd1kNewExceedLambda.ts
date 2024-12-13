/* eslint-disable @typescript-eslint/no-unused-vars */
import Dd1k from "./Dd1k";
import { toProperFraction } from "@/lib/math";

class Dd1kNewExceedLambda extends Dd1k {
  lastInitialCustomerDepartureTime: number;

  constructor(
    arrivalRate: number,
    serviceRate: number,
    capacity: number,
    initialCustomers?: number
  ) {
    super();

    this.type = "λ < μ";

    this.arrivalRate = arrivalRate;
    this.arrivalTime = 1 / arrivalRate;

    this.serviceRate = serviceRate;
    this.serviceTime = 1 / serviceRate;

    this.capacity = capacity;
    this.initialCustomers = initialCustomers;

    this.arrivalRateFraction = toProperFraction(arrivalRate);
    this.serviceRateFraction = toProperFraction(serviceRate);

    this.transientTime = this.findTransientTime();
    this.t_i = this.transientTime;

    this.lambdaTi = this.arrivalRate * this.transientTime;
    this.lambdaTiFloored = Math.floor(this.lambdaTi);

    this.muTi = this.serviceRate * this.transientTime;
    this.muTiFloored = Math.floor(this.muTi);

    this.lastInitialCustomerDepartureTime =
      this.initialCustomers * this.serviceTime;

    this.timeLineData = this.generateTimeGraphData();
    this.customerGraphData = this.generateCustomerGraphData();
  }

  /**
   * Finds the time at which the system reaches steady state.
   * is determined as the smallest t such that n(t) = 0:
   * 0 = M + ⌊λt_i⌋ - ⌊μt_i⌋
   * M = ⌊λt_i⌋ - ⌊μt_i⌋
   * @returns Time at which steady state is reached
   */
  findTransientTime(): number {
    let t_i = 0;
    while (true) {
      t_i += 1; // Increment by inter-arrival time
      const lambdaTi = Math.floor(this.arrivalRate * t_i);
      const muTi = Math.floor(this.serviceRate * t_i);

      if (this.initialCustomers + lambdaTi - muTi <= 0) {
        return t_i;
      }
    }
  }

  //  n(t) = M + ⌊λt⌋ - ⌊μt⌋
  computeNOfT(t: number): number {
    if(t < 0 || isNaN(t)) {
      return undefined;
    }
    if (t < this.transientTime) {
      return (
        this.initialCustomers +
        Math.floor(this.arrivalRate * t) -
        Math.floor(this.serviceRate * t)
      );
    }
    return t % this.arrivalTime === 0 ? 1 : 0;
  }

  /**
   * Computes the average waiting time for initial customers in the system.
   * Initial Average Waiting Time for M Customers:
   * W_q(0) = (M - 1) / (2μ)
   * @returns Average waiting time for initial customers
   */
  avarageWqOfNForInitialCustomers() {
    return (this.initialCustomers - 1) / (2 * this.serviceRate);
  }

  /**
   *  Computes the waiting time for the nth customer.
   * 2. For n < ⌊λt_i⌋:
   * Wq(n) = (M - 1 + n)(1/μ) - n(1/λ)
   *
   * 3. For n ≥ ⌊λt_i⌋:
   * Wq(n) = 0
   * @param nth - The nth customer
   * @returns The waiting time for the customer.
   *
   */
  waitingTimeForNthCustomer(n: number): number {
    if (n <= 0 || isNaN(n)) return undefined;
    if (n < this.lambdaTiFloored) {
      return (
        (this.initialCustomers - 1 + n) * this.serviceTime -
        n * this.arrivalTime
      );
    } else if (n >= this.lambdaTiFloored) {
      return 0;
    }
    return undefined;
  }

  /**
   * Computes the number of initial customers remaining in the system at time t.
   * @param t - Current time
   * @returns Number of initial customers remaining in the system at time t
   */
  computeInitialCustomersRemaining(t: number): number {
    if (t < this.lastInitialCustomerDepartureTime) {
      return this.initialCustomers - Math.floor(t * this.serviceRate);
    } else {
      return 0;
    }
  }

  /**
   * Computes the number of new customers in the system at time t.
   * @param t - Current time
   * @returns Number of new customers in the system at time t
   */
  computeNewCustomersInSystem(t: number): number {
    const totalCustomers = this.computeNOfT(t);

    if (t < this.lastInitialCustomerDepartureTime) {
      return totalCustomers - this.computeInitialCustomersRemaining(t);
    } else {
      return totalCustomers;
    }
  }

  canCustomerEnterSystem(t: number): boolean {
    if (t >= this.transientTime) {
      return true;
    }
    const newCustomers = this.computeNewCustomersInSystem(t);
    return newCustomers < this.capacity;
  }

  graphMaxTime(): number {
    return Math.ceil(
      Math.max(this.transientTime + 5 * (1 / this.arrivalRate), 10)
    );
  }
}

export default Dd1kNewExceedLambda;
