/* eslint-disable @typescript-eslint/no-namespace */

/**
 * Algorithm to analyze and solve the D/D/1/(k-1) queue system for both cases λ > μ and λ ≤ μ,
 * as well as solving for t_i using trial and error.
 *
 * Queue System Type: D/D/1/(k-1)
 * Parameters:
 * - λ: Arrival rate = 1/λ: Inter-arrival time.
 * - μ: Service rate = 1/μ: Service time.
 * - k: Total capacity (including the customer in service).
 *
 * General Algorithm for Queue System D/D/1/(k-1)
 *
 * Step 1: Define System Parameters
 * Given:
 * λ = Arrival rate
 * μ = Service rate.
 *
 * k = Total queue capacity
 * t_i = Time of first balk (time when queue is full)
 *
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
 *
 *
 *
 * -------------------------39----------------------------------
 *Case 2: λ ≤ μ or 1/λ ≥ 1/μ
 * -----------------------------------------------------------
 *This scenario ensures there is never more than one customer in the system,
 *leading to n(t) being either 1 or 0. Waiting time Wq(n) is zero for all n.
 *The study focuses on transient characteristics when starting with M initial
 *customers in the system until steady state is achieved at n(t) = 1 or 0.
 *
 * **Transient Analysis**
 * Let t_i denote the time the steady state is reached:
 *
 * For λ < μ:
 * n(t) = M + ⌊λt⌋ - ⌊μt⌋
 * For λ = μ:
 * t_i = 0, no transient phase exists, and n(t) = M.
 *
 * **Finding t_i**
 * t_i is determined as the smallest t such that n(t) = 0:
 * 0 = M + ⌊λt_i⌋ - ⌊μt_i⌋
 * M = ⌊λt_i⌋ - ⌊μt_i⌋
 *
 * **Average Waiting Time, Wq(n):**
 *
 * 1. Initial Average Waiting Time for M Customers:
 * W_q(0) = (M - 1) / (2μ)
 *
 * 2. For n < ⌊λt_i⌋:
 * Wq(n) = (M - 1 + n)(1/μ) - n(1/λ)
 *
 * 3. For n ≥ ⌊λt_i⌋:
 * Wq(n) = 0
 *
 * For λ = μ:
 * Wq(n) = (M - 1)(1/μ) for all customers.
 *
 */

import { EPSILON } from "@/constants";
import { DD1KCharacteristics, DD1KType } from "@/types/dd1k";
import { Fraction } from "@/types/math";
import { toProperFraction } from "./math";

namespace DD1K {
  /**
   * Calculates the performance metrics for a D/D/1/K queue.
   * @param arrivalRate - The rate at which customers arrive.
   * @param serviceRate - The rate at which customers are served.
   * @param capacity - The maximum number of customers the system can hold.
   * @returns An object containing the calculated metrics.
   */
  export function dd1k(
    arrivalRate: number,
    serviceRate: number,
    capacity: number,
    initialCustomers?: number
  ): DD1KCharacteristics {
    // Convert rates to fractions
    const arrivalRateFraction = toProperFraction(arrivalRate);
    const serviceRateFraction = toProperFraction(serviceRate);

    if (arrivalRate > serviceRate) {
      // Handle Case 1: λ > μ
      return DD1KλExceedμ.arrivalBiggerThanservice(
        arrivalRate,
        serviceRate,
        capacity,
        arrivalRateFraction,
        serviceRateFraction
      );
    } else if (arrivalRate === serviceRate) {
      const result: DD1KCharacteristics = {
        type: "λ = μ",
        arrivalRate: arrivalRate,
        serviceRate: serviceRate,
        arrivalRateFraction: arrivalRateFraction,
        serviceRateFraction: serviceRateFraction,
        capacity: capacity,
        t_i: 0,
        initialCustomers: initialCustomers,
      };
      return result;
    }
    // else {
    //   // Handle Case 2: λ ≤ μ
    //   return handleCase2(arrivalRate, serviceRate, capacity);
    // }
    // Define the equations for n(t) in its three states
  }

  /**
   * Finds the first time the system reaches capacity.
   * @param arrivalRate - The rate at which customers arrive.
   * @param serviceRate - The rate at which customers are served.
   * @param capacity - The maximum number of customers the system can hold.
   * @returns The first time the system reaches capacity.
   */
  export function findFirstBalkTime(
    arrivalRate: number,
    serviceRate: number,
    capacity: number,
    type: DD1KType
  ): number {
    if (type === "λ < μ" || type === "λ = μ") {
      return 0;
    }
    let t_i = 0;
    while (true) {
      t_i += 1 / arrivalRate; // Increment by inter-arrival time
      const lambdaTi = Math.floor(arrivalRate * t_i);
      const muCalculation = serviceRate * t_i - serviceRate / arrivalRate;
      const muTi = Math.floor(muCalculation + EPSILON); // Add epsilon to handle floating-point precision

      if (lambdaTi - muTi >= capacity) return t_i;
    }
  }

  export function graphMaxTime(t_i: number): number {
    return Math.ceil(Math.max(t_i * 2, 10)); // Round up max time
  }
}

export namespace DD1KλExceedμ {
  export function arrivalBiggerThanservice(
    arrivalRate: number,
    serviceRate: number,
    capacity: number,
    arrivalRateFraction: Fraction,
    serviceRateFraction: Fraction
  ): DD1KCharacteristics {
    let systemType: DD1KType = "λ > μ";
    if (arrivalRate % serviceRate === 0) {
      systemType = "(λ > μ) && λ%μ = 0";
    }

    // Calculate the time of first balk (t1)
    const t_i = DD1K.findFirstBalkTime(
      arrivalRate,
      serviceRate,
      capacity,
      systemType
    );

    return {
      type: systemType,
      arrivalRate: arrivalRate,
      serviceRate: serviceRate,
      arrivalRateFraction: arrivalRateFraction,
      serviceRateFraction: serviceRateFraction,
      capacity: capacity,
      t_i: t_i,
    };
  }

  export function computeNOfT(
    t: number,
    arrivalRate: number,
    serviceRate: number,
    t_i: number,
    capacity: number,
    systemType: DD1KType
  ): number {
    if (t < 1 / arrivalRate) {
      // State 1: t < 1/λ
      return 0;
    } else if (t >= 1 / arrivalRate && t < t_i) {
      // State 2: 1/λ < t < t_i
      const lambdaT = Math.floor(arrivalRate * t);
      const muCalculation = serviceRate * t - serviceRate / arrivalRate;
      const muT = Math.floor(muCalculation + EPSILON); // Add epsilon to handle floating-point precision

      const n = lambdaT - muT;
      return n;
    } else {
      // State 3: t ≥ t_i
      if (systemType === "(λ > μ) && λ%μ = 0") {
        // Special case: n(t) remains constant at capacity - 1
        return capacity - 1;
      } else {
        const lambdaT = Math.floor(arrivalRate * t);
        const muCalculation = serviceRate * t - serviceRate / arrivalRate;
        const muT = Math.floor(muCalculation + EPSILON);

        // Determine if n(t) is k-1 or k-2
        const remainder = (lambdaT - muT) % 2; // Modulo 2 to alternate

        if (remainder === 0) {
          return capacity - 2; // k-2
        } else {
          return capacity - 1; // k-1
        }
      }
    }
  }

  /**
   * Checks if a service completion occurs at time t
   * @param t - The current time
   * @param serviceRate - The service rate
   * @returns True if a service completion occurs at time t
   */
  export function isServiceCompletion(
    t: number,
    serviceRate: number,
    arrivalRate: number
  ): boolean {
    const serviceTime = 1 / serviceRate;

    // Check if time t is a service completion time by seeing if (t - 1/λ) is a multiple of service time
    const timeFromFirstService = t - 1 / arrivalRate;

    // Using Math.round to handle floating point precision
    return (
      Math.abs(
        Math.round(timeFromFirstService / serviceTime) -
          timeFromFirstService / serviceTime
      ) < EPSILON
    );
  }

  /**
   * Checks if a customer arriving at time t would be blocked.
   * A customer is blocked if:
   * 1. Time t is less than t_i: customer is never blocked
   * 2. Time t equals t_i: customer is blocked (first blocking)
   * 3. Time t > t_i:
   *    - Current queue state is at capacity (k-1) AND no service completion occurs at time t
   *    - Current queue state is at capacity (k)
   */
  export function isCustomerBlocked(
    t: number,
    arrivalRate: number,
    serviceRate: number,
    capacity: number,
    t_i: number,
    systemType: DD1KType
  ): boolean {
    // Early time checks
    if (t < t_i) return false;
    if (Math.abs(t - t_i) < EPSILON) return true;

    // For t > t_i, check queue state and service completion
    const currentState = computeNOfT(
      t,
      arrivalRate,
      serviceRate,
      t_i,
      capacity,
      systemType
    );

    if (currentState < capacity - 1) {
      return false;
    }

    if (currentState === capacity - 1) {
      return !isServiceCompletion(t, serviceRate, arrivalRate);
    }

    return true;
  }

  /**
   * Computes the waiting time for each customer.
   * @param n - The customer number.
   * @param arrivalRate - The rate at which customers arrive.
   * @param serviceRate - The rate at which customers are served.
   * @param t_i - The time of first balk.
   * @param systemType - The type of the system.
   * @returns The waiting time for the customer.
   */
  export function computeWqOfN(
    n: number,
    arrivalRate: number,
    serviceRate: number,
    t_i: number,
    systemType: DD1KType
  ): number {
    if (n < arrivalRate * t_i) {
      return (1 / serviceRate - 1 / arrivalRate) * (n - 1);
    } else {
      if (systemType === "(λ > μ) && λ%μ = 0") {
        return (1 / serviceRate - 1 / arrivalRate) * (arrivalRate * t_i - 2);
      } else {
        const remainder = n % 2;
        if (remainder === 0) {
          return (1 / serviceRate - 1 / arrivalRate) * (arrivalRate * t_i - 3);
        } else {
          return (1 / serviceRate - 1 / arrivalRate) * (arrivalRate * t_i - 2);
        }
      }
    }
  }
}

export namespace DD1KμEqualλ {
  export function computeNOfT(initialCustomers) {
    return initialCustomers;
  }
  export function computeWqOfN(initialCustomers: number, serviceRate: number) {
    return (initialCustomers - 1) / (1 * serviceRate);
  }
}
export namespace DD1KμExceedλ {
  //  n(t) = M + ⌊λt⌋ - ⌊μt⌋
  export function computeNOfT(
    t: number,
    arrivalRate: number,
    serviceRate: number,
    initialCustomers: number
  ): number {
    return (
      initialCustomers +
      Math.floor(arrivalRate * t) -
      Math.floor(serviceRate * t)
    );
  }

  //    * **Average Waiting Time, Wq(n):**
  //  *
  //  * 1. Initial Average Waiting Time for M Customers:
  //  * W_q(0) = (M - 1) / (2μ)
  //  *
  //  * 2. For n < ⌊λt_i⌋:
  //  * Wq(n) = (M - 1 + n)(1/μ) - n(1/λ)
  //  *
  //  * 3. For n ≥ ⌊λt_i⌋:
  //  * Wq(n) = 0
  export function computeAvarageWqOfNForInitialCustomers(
    initialCustomers: number,
    serviceRate: number
  ) {
    return (initialCustomers - 1) / (2 * serviceRate);
  }
  export function computeWqOfN(
    n: number,
    arrivalRate: number,
    serviceRate: number,
    initialCustomers: number,
    t_i: number // time at which the steady state is reached
  ): number {
    if (n < Math.floor(arrivalRate * t_i)) {
      return (
        (initialCustomers - 1 + n) * (1 / serviceRate) - n * (1 / arrivalRate)
      );
    } else {
      return 0;
    }
  }
}

export default DD1K;
