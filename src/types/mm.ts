export type MMCharacteristics = {
  validSystem: boolean;
  servers: number | undefined;
  capacity: number | undefined;
  arrivalRate: number;
  serviceRate: number;
  rho: number;
  P0: number;
  L: number;
  Lq: number;
  W: number;
  Wq: number;
};
