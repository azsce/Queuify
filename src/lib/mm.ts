import { MMCharacteristics } from "@/types/mm";
import { mmcQueueCalculation } from "./mmc";

export function mm(
  serviceRate: number,
  arrivalRate: number,
  servers: number,
  capacity?: number
): MMCharacteristics {

  const { rho, P0, L, Lq, W, Wq } = mmcQueueCalculation(
    serviceRate,
    arrivalRate,
    servers,
    capacity
  );

  // if (
  // // if (rho >= 1 && (!capacity || capacity < servers)) {
  //   (capacity === undefined && arrivalRate >= serviceRate * servers) || // Infinite capacity and arrival rate is too high
  //   (capacity !== undefined &&
  //     arrivalRate > serviceRate * servers &&
  //     capacity <= servers) || // Finite capacity, arrival rate is too high, and capacity is too small
  //     (rho >= 1 && (!capacity || capacity < servers))
  // ) {
  //   return {
  //     validSystem: false,
  //     servers: servers,
  //     capacity: capacity,
  //     serviceRate: serviceRate,
  //     arrivalRate: arrivalRate,
  //     rho: undefined,
  //     P0: undefined,
  //     L: undefined,
  //     Lq: undefined,
  //     W: undefined,
  //     Wq: undefined,
  //   };
  // }



  return {
    validSystem: true,
    servers: servers,
    capacity: capacity,
    serviceRate: serviceRate,
    arrivalRate: arrivalRate,
    rho: rho,
    P0: P0,
    L: L,
    Lq: Lq,
    W: W,
    Wq: Wq,
  };
}
