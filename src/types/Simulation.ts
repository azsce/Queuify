export type TimeLineData = {
    time: number;

    arrived: boolean;
    arrivals: number;

    blocked?: boolean | null;
    blocks?: number;

    enteredService: boolean;
    serviceEnterancs: number;

    initialEnteredService?: boolean;
    initialServiceEnterances?: number;

    departured: boolean;
    departures: number;
    
    initialDepartured?: boolean;
    initialDepartures?: number;

    numberOfCustomers: number;
    key: number;
  };

  export type CustomerTimeLineData = {
    customer: number;
    arrivalTime: number;
    serviceStartTime: number;
    departureTime: number;
    waitingTime;
  };