/* eslint-disable @typescript-eslint/no-unused-vars */
import DD1K from "./DD1K";
import { toProperFraction } from "@/lib/math";

class DD1KμExceedλ extends DD1K {
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
    this.serviceRate = serviceRate;
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
      this.initialCustomers * (1 / this.serviceRate);
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
    return (
      this.initialCustomers +
      Math.floor(this.arrivalRate * t) -
      Math.floor(this.serviceRate * t)
    );
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
    if (n < Math.floor(this.arrivalRate * this.transientTime)) {
      return (
        (this.initialCustomers - 1 + n) * (1 / this.serviceRate) -
        n * (1 / this.arrivalRate)
      );
    } else {
      return 0;
    }
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
    console.log("canCustomerEnterSystem newCustomers" + newCustomers);
    return newCustomers < this.capacity;
  }

  /**
   * Checks if a service completion occurs at time t
   * @returns True if a service completion occurs at time t
   */
  isServiceCompletion(t: number): boolean {
    throw new Error("Method not implemented.");
  }

  graphMaxTime(): number {
    return Math.ceil(Math.max(this.transientTime * 2, 10)); // Round up max time
  }

  generateServiceTimelineData(
    xAxisMax?: number
  ): Array<{ time: string; service: number; customerIndex: string }> {
    const maxTime = xAxisMax ?? this.graphMaxTime();

    const data = [];
    let currentCustomer = 1;
    let t = 0;

    while (t < maxTime) {
      const roundedTime = Math.round(t).toString();

      if (t < this.lastInitialCustomerDepartureTime) {
        data.push({
          time: roundedTime,
          service: currentCustomer,
          customerIndex: `M${currentCustomer++}`,
          inital: true,
        });
      } else {
        const n = this.computeNOfT(t);
        if (n > 0) {
          data.push({
            time: roundedTime,
            service: currentCustomer,
            customerIndex: `C${currentCustomer++ - this.initialCustomers}`,
            inital: false,
          });
        }
      }

      t += 1 / this.serviceRate;
    }

    console.log("generateServiceTimelineData data", data);

    return data;
  }
}

export default DD1KμExceedλ;
