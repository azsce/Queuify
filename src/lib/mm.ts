import { MMCharacteristics } from "@/types/mm";
import { factorial } from "mathjs";

export function mm(
  arrivalRate: number,
  serviceRate: number,
  capacity: number | undefined,
  servers: number | undefined
): MMCharacteristics {
  const rho = arrivalRate / (servers * serviceRate);
  let L, Lq, W, Wq, P0;

  if (rho >= 1 && (capacity === undefined || capacity > servers)) {
    return {
      validSystem: false,
      servers,
      capacity,
      arrivalRate,
      serviceRate,
      rho,
      P0: 0,
      L: 0,
      Lq: 0,
      W: 0,
      Wq: 0,
    };
  }

  if (capacity === undefined) {
    if (servers === 1) {
      L = rho / (1 - rho);
      Lq = L - rho;
      W = L / arrivalRate;
      Wq = W - 1 / serviceRate;
    } else {
      const erlangC = () => {
        const sumTerm = Array.from(
          { length: servers },
          (_, n) => Math.pow(servers * rho, n) / factorial(n)
        ).reduce((a, b) => a + b, 0);
        const lastTerm =
          Math.pow(servers * rho, servers) / (factorial(servers) * (1 - rho));
        return lastTerm / (sumTerm + lastTerm);
      };

      Lq = ((erlangC() * rho) / (1 - rho)) * servers;
      L = Lq + servers * rho;
      Wq = Lq / arrivalRate;
      W = Wq + 1 / serviceRate;
    }
  } else {
    if (servers === 1) {
      P0 = (1 - rho) / (1 - Math.pow(rho, capacity + 1));
      L =
        (rho *
          (1 -
            (capacity + 1) * Math.pow(rho, capacity) +
            capacity * Math.pow(rho, capacity + 1))) /
        ((1 - rho) * (1 - Math.pow(rho, capacity + 1)));
      Lq =
        L -
        (rho * (1 - Math.pow(rho, capacity))) /
          (1 - Math.pow(rho, capacity + 1));
      W = L / arrivalRate;
      Wq = Lq / arrivalRate;
    } else {
      const Pn = (n: number) => {
        if (n < servers) {
          return (Math.pow(servers * rho, n) / factorial(n)) * P0;
        } else {
          return (
            (Math.pow(servers * rho, n) /
              (factorial(servers) * Math.pow(servers, n - servers))) *
            P0
          );
        }
      };

      const P0_inv =
        Array.from(
          { length: servers },
          (_, n) => Math.pow(servers * rho, n) / factorial(n)
        ).reduce((a, b) => a + b, 0) +
        Array.from(
          { length: capacity + 1 - servers },
          (_, n) =>
            Math.pow(servers * rho, servers + n) /
            (factorial(servers) * Math.pow(servers, n))
        ).reduce((a, b) => a + b, 0);
      P0 = 1 / P0_inv;

      L = Array.from({ length: capacity + 1 }, (_, n) => n * Pn(n)).reduce(
        (a, b) => a + b,
        0
      );
      Lq = L - servers * rho;
      W = L / arrivalRate;
      Wq = Lq / arrivalRate;
    }
  }

  return {
    validSystem: true,
    servers,
    capacity,
    arrivalRate,
    serviceRate,
    rho,
    P0,
    L,
    Lq,
    W,
    Wq,
  };
}
