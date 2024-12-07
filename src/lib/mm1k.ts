
export function mm1k(arrivalRate: number, serviceRate: number, capacity: number) {
  const rho = arrivalRate / serviceRate;
  const P0 = rho !== 1 ? (1 - rho) / (1 - Math.pow(rho, capacity + 1)) : 1 / (capacity + 1);
  const L = rho !== 1 ? (rho * (1 - (capacity + 1) * Math.pow(rho, capacity) + capacity * Math.pow(rho, capacity + 1))) / ((1 - rho) * (1 - Math.pow(rho, capacity + 1))) : capacity / 2;
  const Lq = L - (1 - P0) * rho;
  const effectiveArrivalRate = arrivalRate * (1 - Math.pow(rho, capacity));
  const W = L / effectiveArrivalRate;
  const Wq = Lq / effectiveArrivalRate;

  return {
    rho,
    P0,
    L,
    Lq,
    W,
    Wq,
  };
}