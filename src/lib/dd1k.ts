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
 * Case 1: λ > μ or 1/λ < 1/μ
 * This case occurs when the arrival rate exceeds the service rate. The queue will eventually saturate,
 * and new arrivals will be rejected once the queue reaches capacity.
 *
 * Step 2: Calculate the time of first balk (t_i)
 * 1. k = ⌊λ * t_i⌋ - ⌊μ * t_i - μ / λ⌋
 *
 * Step 3: Check for queue saturation (trial and error)
 * 2. Calculate n(t) using the equation: n(t) = ⌊λ * t⌋ - ⌊μ * t - μ / λ⌋
 * 3. If n(t) >= k, the queue is saturated, and new arrivals are rejected.
 * 4. If n(t) < k, increment t and repeat.
 * 5. Once n(t) >= k, the system transitions to a steady-state alternating between k-1 and k-2 customers.
 *
 * Step 4: Compute Waiting Times (Wq(n))
 * 1. For n < λ * t_i, compute the waiting time for each customer as:
 *    Wq(n) = (1/μ - 1/λ)(n - 1)
 * 2. For n >= λ * t_i, the waiting time alternates between two values based on queue length.
 *
 * Case 2: λ ≤ μ or 1/λ ≥ 1/μ
 * This case occurs when the service rate is sufficient to keep up with the arrival rate. The queue remains stable
 * with either 1 or 0 customers.
 *
 * Step 2: Calculate the steady-state queue
 * 1. For t < 1/λ, n(t) = 0 (queue is empty).
 * 2. For 1/λ ≤ t < t_i, n(t) increases based on arrival and service rates.
 * 3. For t ≥ t_i, n(t) stabilizes at either 0 or 1 customer in the system.
 *
 * Step 3: Compute Waiting Times (Wq(n))
 * 1. For initial customers (M), compute the waiting time as:
 *    Wq(n) = (M - 1 + n) * (1/μ) - n * (1/λ)
 * 2. For n >= λ * t_i, Wq(n) = 0.
 * 3. For λ = μ, Wq(n) = (M - 1) * (1/μ) for all customers.
 *
 * Algorithm for Finding t_i Using Trial and Error
 * The key part of this system is finding the time t_i, the time of the first balk when the queue reaches capacity k.
 * This requires trial and error to find the smallest t_i that satisfies the equation.
 *
 * 1. Solve the equation: k = ⌊λ * t_i⌋ - ⌊μ * t_i - μ / λ⌋
 */


/**
 * Calculates the performance metrics for a D/D/1/K queue.
 * @param arrivalRate - The rate at which customers arrive.
 * @param serviceRate - The rate at which customers are served.
 * @param capacity - The maximum number of customers the system can hold.
 * @returns An object containing the calculated metrics.
 */
export function dd1k(arrivalRate: number, serviceRate: number, capacity: number) {
  // Calculate the time of first balk (t1)
  const t1 = findFirstBalkTime(arrivalRate, serviceRate, capacity);

  // Convert rates to fractions
  const arrivalRateFraction = toProperFraction(arrivalRate);
  const serviceRateFraction = toProperFraction(serviceRate);

  // Define the equations for n(t) in its three states
  const n_t = {
    tLessThan1OverLambda: `0`,
    tBetween1OverLambdaAndTi: `⌊t/${arrivalRateFraction.denominator}⌋ - ⌊t/${serviceRateFraction.denominator} - ${arrivalRateFraction.denominator}/${serviceRateFraction.denominator}⌋`,
    tGreaterThanOrEqualTi: `⌊t/${arrivalRateFraction.denominator}⌋ - ⌊t/${serviceRateFraction.denominator} - ${arrivalRateFraction.denominator}/${serviceRateFraction.denominator}⌋`
  };

  // Define the equations for Wq(n) in its three states
  const Wq_n = {
    n0: `0`,
    nLessThanLambdaTi: `(1 / ${serviceRateFraction.numerator}/${serviceRateFraction.denominator} - 1 / ${arrivalRateFraction.numerator}/${arrivalRateFraction.denominator}) * (n - 1)`,
    nGreaterThanOrEqualLambdaTi: `0`
  };

  // If the arrival rate is greater than the service rate
  if (arrivalRate > serviceRate) {
    // Calculate the blocking probability
    const blockingProbability = calculateBlockingProbability(arrivalRate, serviceRate, capacity);
    return { 
      n_t, 
      Wq_n, 
      t1, 
      blockingProbability, 
      case: "λ > μ"
    };
  } else {
    return { 
      n_t, 
      Wq_n, 
      t1, 
      case: "λ ≤ μ"
    };
  }
}

/**
 * Finds the first time the system reaches capacity.
 * @param arrivalRate - The rate at which customers arrive.
 * @param serviceRate - The rate at which customers are served.
 * @param capacity - The maximum number of customers the system can hold.
 * @returns The first time the system reaches capacity.
 */
function findFirstBalkTime(arrivalRate: number, serviceRate: number, capacity: number): number {
  console.log(`Finding t_i for λ=${arrivalRate}, μ=${serviceRate}, k=${capacity}`);
  let t1 = 0;
  const epsilon = 1e-6; // Tolerance for floating-point comparison
  while (true) {
    t1 += 1 / arrivalRate; // Increment by inter-arrival time
    const lambdaTi = Math.floor(arrivalRate * t1);
    const muCalculation = (serviceRate * t1) - (serviceRate / arrivalRate);
    const muTi = Math.floor(muCalculation + epsilon); // Add epsilon to handle floating-point precision
    console.log(`t1=${t1}, lambdaTi=${lambdaTi}, muTi=${muTi}, difference=${lambdaTi - muTi}`);
    if ((lambdaTi - muTi) >= capacity) return t1;
  }
}

/**
 * Calculates the blocking probability for a D/D/1/K queue.
 * @param arrivalRate - The rate at which customers arrive.
 * @param serviceRate - The rate at which customers are served.
 * @param capacity - The maximum number of customers the system can hold.
 * @returns The blocking probability.
 */
function calculateBlockingProbability(arrivalRate: number, serviceRate: number, capacity: number): number {
  const N = Math.floor(serviceRate / (arrivalRate - serviceRate));
  const B = capacity + N - capacity * N;
  return B / (capacity + N);
}

/**
 * Converts a decimal number to a proper fraction.
 * @param decimal - The decimal number to convert.
 * @returns The fraction in the form of an object { numerator, denominator }.
 */
function toProperFraction(decimal: number): { numerator: number, denominator: number } {
  const tolerance = 1.0E-6;
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = decimal;
  do {
    const a = Math.floor(b);
    let aux = h1; h1 = a * h1 + h2; h2 = aux;
    aux = k1; k1 = a * k1 + k2; k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

  return { numerator: h1, denominator: k1 };
}