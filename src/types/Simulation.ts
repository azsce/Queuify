export type TimeLineData = {
  time: number;

  arrived: boolean;
  arrivalCount: number;
  arrivalCustomers: Set<number>;

  blocked?: boolean | null;
  blockCount?: number;

  enteredService: boolean;
  serviceCount: number;
  serviceCustomers: Set<number>;

  initialEnteredService?: boolean;
  initialServiceEnterances?: number;

  departured: boolean;
  departureCount: number;
  departureCustomers: Set<number>;

  initialDepartured?: boolean;
  initialDepartures?: number;

  numberOfCustomers: number;
  key: number;
};

export type Customer = {
  customerId: number;
  arrivalTime?: number;
  blocked: boolean;
  serviceStartTime?: number;
  departureTime?: number;
  waitingInSystemTime?: number;
  waitingInQueueTime?: number;
};
