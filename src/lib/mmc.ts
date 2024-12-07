
export function mmc(arrivalRate: number, serviceRate: number, servers: number) {
  const r = arrivalRate / serviceRate;
  const rho = r / servers;
  const P0 = 1 / (Array.from({ length: servers }, (_, n) => Math.pow(r, n) / factorial(n)).reduce((a, b) => a + b, 0) + (Math.pow(r, servers) / factorial(servers)) * (1 / (1 - rho)));
  const Lq = (Math.pow(r, servers) * rho * P0) / (factorial(servers) * Math.pow(1 - rho, 2));
  const Wq = Lq / arrivalRate;
  const W = Wq + 1 / serviceRate;
  const L = arrivalRate * W;

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