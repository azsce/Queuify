
export function mmck(arrivalRate: number, serviceRate: number, servers: number, capacity: number) {
  const r = arrivalRate / serviceRate;
  const P0 = 1 / (Array.from({ length: servers }, (_, n) => Math.pow(r, n) / factorial(n)).reduce((a, b) => a + b, 0) + (Math.pow(r, servers) / factorial(servers)) * Array.from({ length: capacity - servers + 1 }, (_, n) => Math.pow(r / servers, n)).reduce((a, b) => a + b, 0));
  const Lq = (Math.pow(r, servers) * rho * P0 * (1 - Math.pow(r / servers, capacity - servers + 1) + (capacity - servers) * Math.pow(r / servers, capacity - servers))) / (factorial(servers) * Math.pow(1 - rho, 2));
  const effectiveArrivalRate = arrivalRate * (1 - Math.pow(r / servers, capacity));
  const Wq = Lq / effectiveArrivalRate;
  const W = Wq + 1 / serviceRate;
  const L = effectiveArrivalRate * W;

  return {
    rho,
    P0,
    L,
    Lq,
    W,
    Wq,
  };
}

function factorial(n: number): number {
  return n <= 1 ? 1 : n * factorial(n - 1);
}