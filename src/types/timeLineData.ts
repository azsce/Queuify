export type timeLineData = {
    time: number;

    arrived: boolean;
    arrivals: number;

    blocked: boolean | null;
    blocks: number;

    enteredService: boolean;
    serviceEnterancs: number;
    initialEnteredService?: boolean;
    initialServiceEnterancs?: number;

    departured: boolean;
    departures: number;
    initialDepartured?: boolean;
    initialDepartures?: number;

    numberOfCustomers: number;

    key: number;
  };