export type MMCharacteristics = {
  validSystem: boolean;
  servers: number | undefined;
  capacity: number | undefined;
  serviceRate: number;
  arrivalRate: number;
  rho: number;
  P0: number;
  L: number;
  Lq: number;
  W: number;
  Wq: number;
};

export type MmStatistics = {
  totalWaitingTime: number;
  averageWaitingTime: number;
  totalWaitingTimeInQueue: number;
  averageWaitingTimeInQueue: number;
  totalIdleServerTime: number;
  averageIdleServerTime: number;
  totalBlockedCustomers: number;
  blockingProbability: number;
};