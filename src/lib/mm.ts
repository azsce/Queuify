import { MMCharacteristics } from "@/types/mm";
import { mmcQueueCalculation } from "./mmc";

export function mm(
  arrivalRate: number,
  serviceRate: number,
  capacity: number | undefined,
  servers: number | undefined
): MMCharacteristics {
  const [rho, P0, Lq, L, Wq, W] = mmcQueueCalculation(
    arrivalRate,
    serviceRate,
    servers,
    capacity
  );

  if (rho >= 1 && (!capacity || capacity > servers)) {
    return {
      validSystem: false,
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
