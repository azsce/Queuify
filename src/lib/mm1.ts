
export function mm1(arrivalRate: number, serviceRate: number) {
  const rho = arrivalRate / serviceRate;
  const P0 = 1 - rho;
  const L = rho / (1 - rho);
  const Lq = Math.pow(rho, 2) / (1 - rho);
  const W = 1 / (serviceRate - arrivalRate);
  const Wq = Lq / arrivalRate;

  return {
    rho,
    P0,
    L,
    Lq,
    W,
    Wq,
  };
}