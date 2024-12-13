/**
 * Algorithm to analyze and solve the M/M/s queue system.
 *
 * Queue System Type: M/M/s
 * Parameters:
 * - λ: Arrival rate
 * - μ: Service rate
 * - s: Number of servers
 * - k: Maximum number of customers in the system (optional)
 *
 * General Algorithm for Queue System M/M/s
 *
 * Step 1: Calculate Traffic Intensity (ρ)
 * Given:
 * λ = Arrival rate
 * μ = Service rate
 * s = Number of servers
 * Calculate:
 * τ = λ / μ
 * ρ = τ / s
 *
 * Step 2: Calculate the probability of no customer in the queue (P0)
 * Given:
 * τ = λ / μ
 * ρ = τ / s
 * s = Number of servers
 * k = Maximum number of customers in the system (optional)
 * Calculate:
 * P0 using the appropriate formula based on whether k is provided or not.
 *
 * Step 3: Calculate the average number of customers in the queue (Lq)
 * Given:
 * τ = λ / μ
 * ρ = τ / s
 * P0 = Probability of no customer in the queue
 * s = Number of servers
 * k = Maximum number of customers in the system (optional)
 * Calculate:
 * Lq using the appropriate formula based on whether k is provided or not.
 *
 * Step 4: Calculate the average number of customers in the system (L)
 * Given:
 * Lq = Average number of customers in the queue
 * τ = λ / μ
 * Calculate:
 * L = Lq + τ
 *
 * Step 5: Calculate the average time spent in the system (W)
 * Given:
 * L = Average number of customers in the system
 * λ = Arrival rate
 * Calculate:
 * W = L / λ
 *
 * Step 6: Calculate the average time spent in the queue (Wq)
 * Given:
 * Lq = Average number of customers in the queue
 * λ = Arrival rate
 * Calculate:
 * Wq = Lq / λ
 *
 * Step 7: Calculate the probability of having 'n' customers in the system (Pn)
 * Given:
 * n = Number of customers
 * λ = Arrival rate
 * μ = Service rate
 * s = Number of servers
 * P0 = Probability of no customer in the queue
 * k = Maximum number of customers in the system (optional)
 * Calculate:
 * Pn using the appropriate formula based on whether k is provided or not.
 */

import { factorial } from "./utils";

// Traffic Intensity (ρ) return [tau, rho]
const mmcTrafficIntensity = (
  lambda: number, // arrival rate
  mu: number, // service rate
  s: number // number of servers
) => {
  const tau = lambda / mu;
  const rho = tau / s; // or lambda / (mu * s)
  return [tau, rho];
};

// probability of no customer in the queue (P0)
const mmcProbabilityOfNoCustomerInQueue = (
  tau: number, // tau (lambda/mu)
  rho: number,
  s: number,
  k?: number
): number => {
  let sum = 0;

  // tau (lambda / mu) = s * rho
  for (let i = 0; i < s; i++) {
    sum += Math.pow(tau, i) / factorial(i);
  }

  // if it has maximum number of customers (M/M/s/K)
  if (k) {
    let x = Math.pow(tau, s) / factorial(s);
    if (rho == 1) {
      x *= k - s + 1;
    } else {
      x *= (1 - Math.pow(rho, k - s + 1)) / (1 - rho);
    }
    sum += x;
  } else {
    sum += Math.pow(tau, s) / (factorial(s) * (1 - rho));
  }

  return 1 / sum; // Math.pow(sum, -1);
};

// Average number of customers in the queue (Lq) (M/M/s)
const mmcAvgCustomersQueue = (
  tau: number, // tau (lambda / mu)
  rho: number, // arrival rate
  p0: number, // probability of no customer in the queue (P0)
  s: number // number of servers
) => {
  return (rho * Math.pow(tau, s) * p0) / (factorial(s) * Math.pow(1 - rho, 2));
};

// Average number of customers in the queue (Lq) (M/M/s/K)
const mmckAvgCustomersQueue = (
  tau: number, // tau (lambda / mu)
  rho: number, // arrival rate
  p0: number, // probability of no customer in the queue (P0)
  s: number, // number of servers
  k: number
) => {
  let x = (p0 * Math.pow(tau, s)) / factorial(s);
  if (rho == 1) {
    x *= ((k - s) * (k - s + 1)) / 2;
  } else {
    x *=
      (rho *
        (1 -
          Math.pow(rho, k - s + 1) -
          (k - s + 1) * Math.pow(rho, k - s) * (1 - rho))) /
      Math.pow(1 - rho, 2);
  }
  return x;
};

// Average number of customers (L) (M/M/s)
const mmcAvgCustomersInSystem = (
  lq: number, // Average number of customers in the queue (Lq)
  tau: number // tau
) => {
  return lq + tau;
};

// Average number of customers (L) (M/M/s/K)
const mmckAvgCustomersInSystem = (
  lq: number, // Average number of customers in the queue (Lq)
  tau: number, // tau
  offset: number
) => {
  return lq + tau * offset;
};

// Average time spent in the system (W)
const mmcAvgTimeInSystem = (
  l: number, // Average number of customers (L)
  lambda: number // arrival rate
) => {
  return l / lambda;
};

// Average time spent in the queue (WQ)
const mmcAvgTimeInQueue = (
  lq: number, // Average number of customers in the queue (Lq)
  lambda: number // arrival rate
) => {
  return lq / lambda;
};

// Probability of a queue with 'n' customers (Pn)
export const mmcProbabilityN = (
  n: number, // number of customers (n)
  lambda: number, // arrival rate
  mu: number, // service rate
  s: number, // number of servers
  p0: number, // probability of no customer in the queue (P0)
  k?: number // maximum number of customers in system
) => {
  if (k && n > k) {
    return 0;
  }
  if (n <= s) {
    return (Math.pow(lambda, n) / (factorial(n) * Math.pow(mu, n))) * p0;
  }
  return (
    (Math.pow(lambda, n) /
      (Math.pow(s, n - s) * factorial(s) * Math.pow(mu, n))) *
    p0
  );
};

// calculate M/M/s queue return [rho, p0, lq, l, wq, w]
export function mmcQueueCalculation(
  mu: number, // service rate
  lambda: number, // arrival rate
  s: number, // number of servers
  k?: number // maximum number of customers in system
) {
  const [tau, rho] = mmcTrafficIntensity(lambda, mu, s);
  const P0 = mmcProbabilityOfNoCustomerInQueue(tau, rho, s, k);

  let Lq = 0;
  let L = 0;

  if (k) {
    const offset = 1 - mmcProbabilityN(k, lambda, mu, s, P0, k);

    Lq = mmckAvgCustomersQueue(tau, rho, P0, s, k);
    L = mmckAvgCustomersInSystem(Lq, tau, offset);

    // lambda-bar (λ-bar)
    lambda *= offset;
  } else {
    Lq = mmcAvgCustomersQueue(tau, rho, P0, s);
    L = mmcAvgCustomersInSystem(Lq, tau);
  }

  const Wq = mmcAvgTimeInQueue(Lq, lambda);
  const W = mmcAvgTimeInSystem(L, lambda);

  return { rho, P0, L, Lq, W, Wq };
}

export {
  mmcTrafficIntensity,
  mmcProbabilityOfNoCustomerInQueue,
  mmcAvgCustomersQueue,
  mmckAvgCustomersQueue,
  mmcAvgCustomersInSystem,
  mmckAvgCustomersInSystem,
  mmcAvgTimeInSystem,
  mmcAvgTimeInQueue,
};
