export type TimeLineData = {
  time: number;

  arrived: boolean;
  arrivals: number;
  arrivalCustomers: Set<number>;

  blocked?: boolean | null;
  blocks?: number;

  enteredService: boolean;
  serviceEnterancs: number;
  serviceCustomers: Set<number>;

  initialEnteredService?: boolean;
  initialServiceEnterances?: number;

  departured: boolean;
  departures: number;
  departureCustomers: Set<number>;

  initialDepartured?: boolean;
  initialDepartures?: number;

  numberOfCustomers: number;
  key: number;
};

export type CustomerTimeLineData = {
  customer: number;
  arrivalTime?: number;
  serviceStartTime?: number;
  departureTime?: number;
  waitingInSystemTime?: number;
  waitingInQueueTime?: number;
};
