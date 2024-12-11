/* eslint-disable @typescript-eslint/no-unused-vars */

import DD1K from "./DD1K";
import { toProperFraction } from "@/lib/math";

class DD1KμEqualλ extends DD1K {
  lastInitialCustomerDepartureTime: number;
  constructor(
    arrivalRate: number,
    serviceRate: number,
    capacity: number,
    initialCustomers?: number
  ) {
    super();
    this.type = "λ = μ";

    this.arrivalRate = arrivalRate;
    this.arrivalTime = 1 / arrivalRate;

    this.serviceRate = serviceRate;
    this.serviceTime = 1 / serviceRate;

    this.capacity = capacity;
    this.initialCustomers = initialCustomers;

    this.arrivalRateFraction = toProperFraction(arrivalRate);
    this.serviceRateFraction = toProperFraction(serviceRate);

    this.transientTime = 0;
    this.t_i = this.transientTime;

    this.lastInitialCustomerDepartureTime =
      this.initialCustomers * this.serviceTime;

      this.timeLineData = this.generateTimeGraphData();
      this.customerGraphData = this.generateCustomerGraphData();
  }

  computeNOfT(initialCustomers) {
    return initialCustomers;
  }

  waitingTimeForNthCustomer(n: number) {
    return (this.initialCustomers - 1) / (1 * this.serviceRate);
  }

  graphMaxTime(): number {
    return Math.ceil(Math.max((1 / this.arrivalRate) * 10, 10));
  }
}

export default DD1KμEqualλ;
