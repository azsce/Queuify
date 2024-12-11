import { DD1KType } from "@/types/dd1k";
import { Fraction } from "@/types/math";

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

abstract class DD1K {
  arrivalRate: number;
  serviceRate: number;
  capacity: number;
  initialCustomers?: number;
  arrivalRateFraction: Fraction;
  serviceRateFraction: Fraction;

  arrivalTime: number;
  serviceTime: number;

  firstBalkTime?: number;
  transientTime?: number;

  t_i: number;

  lambdaTi: number;
  lambdaTiFloored: number;
  muTi: number;
  muTiFloored: number;

  type: DD1KType;

  /**
   * Computes the number of customers in the system at time t.
   * @param t - Current time
   * @returns Number of customers in the system at time t
   */
  abstract computeNOfT(t: number): number;

  /**
   * Computes the waiting time for the nth customer.
   * @param nth - The nth customer
   * @returns The waiting time for the customer.
   */
  abstract waitingTimeForNthCustomer(nth: number): number;

  /**
   * Checks if a service completion occurs at time t
   * @returns True if a service completion occurs at time t
   */
  abstract isServiceCompletion(t: number): boolean;

  /**
   * Checks if a customer can enter the system at time t.
   * @param t - Time at which customer arrives
   * @returns True if customer is blocked
   */
  abstract canCustomerEnterSystem(t: number): boolean;

  graphMaxTime(): number {
    return Math.ceil(Math.max(this.t_i * 2, 10)); // Round up max time
  }

  generateArrivalTimelineData(xAxisMax?: number): Array<{
    time: number;
    arrival: number;
    blocked: boolean;
  }> {
    const data = [];
    const maxTime = xAxisMax ?? this.graphMaxTime();
    const timeStep = 1 / this.arrivalRate;

    // Start with t=0 for initial state
    data.push({
      time: 0,
      arrival: 0,
      blocked: false,
    });

    // Generate rest of the timeline
    for (let t = timeStep; t <= maxTime + 0.5; t += timeStep) {
      const arrivals = Math.floor(t * this.arrivalRate);
      const blocked = !this.canCustomerEnterSystem(t);
      data.push({
        time: Math.round(t), // Round time to whole numbers
        arrival: arrivals,
        blocked: blocked,
      });
    }
    return data;
  }

  generateXAxisSteps(xAxisMax: number): Array<{
    time: string;
  }> {
    const maxTime = xAxisMax ?? this.graphMaxTime();
    const steps = [];
    const timeStep = 1 / this.arrivalRate;
    for (let t = 0; t <= maxTime; t += timeStep) {
      steps.push({
        time: t.toString(),
      });
    }
    return steps;
  }

  abstract generateServiceTimelineData(xAxisMax?: number): Array<{
    time: string;
    service: number;
    customerIndex: string;
    isInitialCustomer?: boolean;
  }>;
}

export default DD1K;
