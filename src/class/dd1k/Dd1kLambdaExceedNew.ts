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
import Dd1k from "./Dd1k";
class Dd1kLambdaExceedNew extends Dd1k {
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

    this.timeLineData = this.generateTimeGraphData();
    this.customerGraphData = this.generateCustomerGraphData();
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
    if(t < 0 || isNaN(t)) {
      return undefined;
    }
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

  waitingTimeForNthCustomer(n: number): number {
    if (n <= 0 || isNaN(n) || !Number.isInteger(n)) return undefined;
    if (n < this.arrivalRate * this.firstBalkTime) {
      return (this.serviceTime - 1 / this.arrivalRate) * (n - 1);
    } else {
      return this.waitingTimeForNthCustomerAtSteadyState(n);
    }
    return undefined;
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
}

export default Dd1kLambdaExceedNew;
