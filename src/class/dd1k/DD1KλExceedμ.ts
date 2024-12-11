/**
 * -----------------------------------------------------------
 * Case 1: λ > μ or 1/λ < 1/μ
 * -----------------------------------------------------------
 * This case occurs when the arrival rate exceeds the service rate. The queue will eventually saturate,
 * and new arrivals will be rejected once the queue reaches capacity.
 *
 * -----------------------------------------------------------
 * Special Case: When λ/μ = m, where m is an integer (λ%μ = 0)
 * -----------------------------------------------------------
 * At steady state (t ≥ t_i):
 * 1. n(t) remains constant.
 * 2. Wq(n) is constant and calculated as:
 *                          Wq(n) = (1/μ - 1/λ) * (λ * t_i - 2)
 *
 * Step 2: Calculate the time of first balk (t_i) using equation:
 *               k = ⌊λ * t_i⌋ - ⌊μ * t_i - μ / λ⌋
 *
 * Step 3: Calculate the number of customers in the system (n(t))
 * 1. For t < 1/λ, n(t) = 0 (queue is empty).
 * 2. For 1/λ ≤ t < t_i, n(t) increases based on arrival and service rates typically calculated as:
 *                    n(t) = ⌊t/λ⌋ - ⌊t/μ - 1/μ⌋
 * 3. For t ≥ t_i, n(t) stabilizes at k-1 or k-2 customers.
 *          [n(t) >= k, the queue is saturated, and new arrivals are rejected]
 *      Once n(t) ≥ k, the system transitions to a steady-state where the system remains full,
 *      alternating between k-1 and k-2 customers as customers leave and new customers enter.
 *      **Special Case:** When λ%μ = 0, where m is an integer:
 *      - n(t) remains constant at k-1.
 *
 *
 * Step 4: Compute Waiting Times (Wq(n))
 * 1. For n < λ * t_i, compute the waiting time for each customer as:
 *                    Wq(n) = (1/μ - 1/λ)(n - 1)
 * 2. For n ≥ λ * t_i, the waiting time alternates between two values
 *          (1/μ - 1/λ) * (λ * t_i - 2)
 *       and
 *          (1/μ - 1/λ) * (λ * t_i - 3)
 *    **Special Case:** When λ%μ = 0, where m is an integer:
 *    - Wq(n) is constant and calculated as:
 *                      Wq(n) = (1/μ - 1/λ) * (λ * t_i - 2)
 */

import { EPSILON } from "@/constants";
import { toProperFraction } from "@/lib/math";
import DD1K from "./DD1K";
import { timeLineData } from "@/types/timeLineData";
class DD1KλExceedμ extends DD1K {
  constructor(arrivalRate: number, serviceRate: number, capacity: number) {
    super();

    this.type = "λ > μ";

    this.arrivalRate = arrivalRate;
    this.arrivalTime = 1 / arrivalRate;

    this.serviceRate = serviceRate;
    this.serviceTime = 1 / serviceRate;

    this.capacity = capacity;

    this.arrivalRateFraction = toProperFraction(arrivalRate);
    this.serviceRateFraction = toProperFraction(serviceRate);

    this.firstBalkTime = this.findFirstBalkTime();
    this.t_i = this.firstBalkTime;

    this.lambdaTi = this.arrivalRate * this.firstBalkTime;
    this.lambdaTiFloored = Math.floor(this.lambdaTi);

    this.muTi = this.serviceRate * this.firstBalkTime;
    this.muTiFloored = Math.floor(this.muTi);

    this.timeLineData = this.generateTimeData();
  }

  /**
   * Finds the first time the system reaches capacity,
   * using trial and error to find the time of first balk (t_i).
   * k = ⌊λ * t_i⌋ - ⌊μ * t_i - μ / λ⌋
   *
   * @returns The first time the system reaches capacity.
   */
  findFirstBalkTime(): number {
    let firstBalkTime = 0;
    while (true) {
      firstBalkTime += 1 / this.arrivalRate; // Increment by inter-arrival time
      const lambdaTiFloored = Math.floor(this.arrivalRate * firstBalkTime);
      const muTi = this.serviceRate * firstBalkTime;
      const muTiMinusMuOverLambda = muTi - this.serviceRate / this.arrivalRate;

      const muTiMinusMuOverLambdaFloored = Math.floor(
        muTiMinusMuOverLambda + EPSILON
      ); // Add epsilon to handle floating-point precision

      if (lambdaTiFloored - muTiMinusMuOverLambdaFloored >= this.capacity)
        return firstBalkTime;
    }
  }

  computeNOfT(t: number): number {
    if (t < 1 / this.arrivalRate) {
      // State 1: t < 1/λ
      return 0;
    } else if (t >= 1 / this.arrivalRate && t < this.firstBalkTime) {
      // State 2: 1/λ < t < t_i
      const lambdaT = Math.floor(this.arrivalRate * t);
      const muCalculation =
        this.serviceRate * t - this.serviceRate / this.arrivalRate;
      const muT = Math.floor(muCalculation + EPSILON); // Add epsilon to handle floating-point precision

      const n = lambdaT - muT;
      return n;
    } else {
      return this.computeNOfTAtSteadyState(t);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  computeNOfTAtSteadyState(t: number): number {
    const lambdaT = Math.floor(this.arrivalRate * t);
    const muCalculation =
      this.serviceRate * t - this.serviceRate / this.arrivalRate;
    const muT = Math.floor(muCalculation + EPSILON);

    // Determine if n(t) is k-1 or k-2
    const remainder = (lambdaT - muT) % 2; // Modulo 2 to alternate

    if (remainder === 0) {
      return this.capacity - 2; // k-2
    } else {
      return this.capacity - 1; // k-1
    }
  }

  isServiceCompletion(t: number): boolean {
    const serviceTime = this.serviceTime;

    // Check if time t is a service completion time by seeing if (t - 1/λ) is a multiple of service time
    const timeFromFirstService = t - 1 / this.arrivalRate;

    // Using Math.round to handle floating point precision
    return (
      Math.abs(
        Math.round(timeFromFirstService / serviceTime) -
          timeFromFirstService / serviceTime
      ) < EPSILON
    );
  }

  /**
   * Checks if a customer can enter the system at time t (i.e., not blocked).
   * * A customer is blocked if:
   * 1. Time t is less than t_i: customer is never blocked
   * 2. Time t equals t_i: customer is blocked (first blocking)
   * 3. Time t > t_i:
   *    - Current queue state is at capacity (k-1) AND no service completion occurs at time t
   *    - Current queue state is at capacity (k)
   * @param t - Time at which customer arrives
   * @returns True if customer is blocked
   */
  canCustomerEnterSystem(t: number): boolean {
    // Early time checks
    if (t < this.firstBalkTime) return true;
    if (Math.abs(t - this.firstBalkTime) < EPSILON) return false;

    // For t > t_i, check queue state and service completion
    const currentState = this.computeNOfT(t);

    if (currentState < this.capacity - 1) {
      return true;
    }

    if (currentState === this.capacity - 1) {
      return this.isServiceCompletion(t);
    }

    return false;
  }

  waitingTimeForNthCustomer(n: number): number {
    if (n === 0) {
      return 0;
    } else if (n < this.arrivalRate * this.firstBalkTime) {
      return (this.serviceTime - 1 / this.arrivalRate) * (n - 1);
    } else {
      return this.waitingTimeForNthCustomerAtSteadyState(n);
    }
  }

  waitingTimeForNthCustomerAtSteadyState(n: number): number {
    const remainder = n % 2;
    if (remainder === 0) {
      return (
        (this.serviceTime - 1 / this.arrivalRate) *
        (this.arrivalRate * this.firstBalkTime - 3)
      );
    } else {
      return (
        (this.serviceTime - 1 / this.arrivalRate) *
        (this.arrivalRate * this.firstBalkTime - 2)
      );
    }
  }

  // generateServiceTimelineData() {
  //   const data = [];
  //   const maxTime = DD1K.graphMaxTime(t_i);
  //   const timeStep = 1 / arrivalRate; // Match arrival timeline step
  //   const serviceTime = 1 / serviceRate;
  //   const firstServiceTime = 1 / arrivalRate;

  //   // Start with t=0 for initial state
  //   data.push({
  //     time: "0",
  //     service: 0,
  //     customerIndex: "",
  //   });

  //   let currentCustomer = 1;

  //   // Generate data points for each time step
  //   for (let t = timeStep; t <= maxTime; t += timeStep) {
  //     const roundedTime = Math.round(t).toString();
  //     if (
  //       t >= firstServiceTime &&
  //       (t - firstServiceTime) % serviceTime < timeStep
  //     ) {
  //       data.push({
  //         time: roundedTime,
  //         service: currentCustomer,
  //         customerIndex: `C${currentCustomer++}`,
  //       });
  //     } else {
  //       data.push({
  //         time: roundedTime,
  //         service: null,
  //         customerIndex: "",
  //       });
  //     }
  //   }
  //   return data;
  // }

  generateTimeData(xAxisMax?: number): timeLineData[] {
    const timelineData: timeLineData[] = [];

    const maxTime = xAxisMax ?? this.graphMaxTime();

    let key = 0;

    let arrivals = 0;
    let serviceEnterancs = 0;
    let departures = 0;
    let blocks = 0;

    let nextArrivalTime = this.arrivalTime;
    let nextServiceEnteranceTime = nextArrivalTime;
    let nextDepartureTime = nextArrivalTime + this.serviceTime;

    let numberOfCustomers = 0;

    for (let t = 0; t <= maxTime; t++) {
      let arrived = false;
      let blocked: boolean | null = null;
      let departured = false;
      let enteredService = false;
      const time = Math.round(t);

      if (t === nextDepartureTime) {
        departured = true;
        departures++;
        numberOfCustomers--;
        nextDepartureTime += this.serviceTime;
      }

      if (t === nextServiceEnteranceTime) {
        enteredService = true;
        serviceEnterancs++;
        nextServiceEnteranceTime += this.serviceTime;
      }

      if (t === nextArrivalTime) {
        arrived = true;
        blocked = numberOfCustomers >= this.capacity - 1;
        arrivals++;
        nextArrivalTime += this.arrivalTime;
        if (blocked){
          blocks++;
        }else{
          numberOfCustomers++;
        }
      }

      const d = {
        time: time,
        arrived: arrived,
        arrivals: arrivals,
        blocked: blocked,
        blocks: blocks,
        enteredService: enteredService,
        serviceEnterancs: serviceEnterancs,
        departured: departured,
        departures: departures,
        numberOfCustomers: numberOfCustomers,
        key: key++,
      };

      console.log("generateTimeData t", t, "d", d);

      timelineData.push(d);
    }

    return timelineData;
  }

  generateServiceTimelineData(xAxisMax?: number) {
    const data = [];
    const maxTime = xAxisMax ?? this.graphMaxTime();
    const arrivalTime = 1 / this.arrivalRate; // Match arrival timeline step
    const serviceTime = this.serviceTime;
    let key = 0;
    // Start with t=0 for initial state
    data.push({
      time: 0,
      service: 0,
      customerIndex: "",
      key: key++,
    });

    let currentCustomer = 1;
    let nextServiceTime = arrivalTime;

    // Generate data points for each time step
    for (let t = 0; t <= maxTime; t++) {
      const roundedTime = Math.round(t);
      if (t === nextServiceTime) {
        data.push({
          time: roundedTime,
          service: currentCustomer,
          customerIndex: `C${currentCustomer++}`,
          key: key++,
        });
        nextServiceTime += serviceTime;
      } else {
        data.push({
          time: roundedTime,
          service: null,
          customerIndex: "",
          key: key++,
        });
      }
    }
    return data;
  }
}

export default DD1KλExceedμ;
