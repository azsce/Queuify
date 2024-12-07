export function dd1k(arrivalRate: number, serviceRate: number, capacity: number, time: number) {
  const n = Math.floor(arrivalRate * time) - Math.floor(serviceRate * time - serviceRate / arrivalRate);
  if (n <= capacity) {
    const Wq = (1 / serviceRate - 1 / arrivalRate) * (n - 1);
    return { n, Wq };
  } else {
    const t1 = findFirstBalkTime(arrivalRate, serviceRate, capacity);
    const Wq = (1 / serviceRate - 1 / arrivalRate) * (capacity - 1);
    const blockingProbability = calculateBlockingProbability(arrivalRate, serviceRate, capacity);
    return { n: capacity, t1, Wq, blockingProbability };
  }
}

function findFirstBalkTime(arrivalRate: number, serviceRate: number, capacity: number): number {
  let t1 = capacity / arrivalRate;
  while (true) {
    const testK = Math.floor(arrivalRate * t1) - Math.floor(serviceRate * t1 - serviceRate / arrivalRate);
    if (testK === capacity) return t1;
    t1 += testK < capacity ? 0.01 : -0.01;
  }
}

function calculateBlockingProbability(arrivalRate: number, serviceRate: number, capacity: number): number {
  const N = Math.floor(serviceRate / (arrivalRate - serviceRate));
  const B = capacity + N - capacity * N;
  return B / (capacity + N);
}