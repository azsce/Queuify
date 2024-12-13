/* eslint-disable @typescript-eslint/no-unused-vars */

import Dd1k from "./Dd1k";
import { toProperFraction } from "@/lib/math";

class Dd1kLambdaEqualNew extends Dd1k {
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

    this.transientTime = undefined;
    this.t_i = undefined;

    this.lastInitialCustomerDepartureTime =
      this.initialCustomers * this.serviceTime;

    this.timeLineData = this.generateTimeGraphData();
    this.customerGraphData = this.generateCustomerGraphData();
  }

  computeNOfT(t: number) {
    if (t < 0 || isNaN(t)) {
      return undefined;
    }
    return this.initialCustomers;
  }

  waitingTimeForNthCustomer(n: number) {
    if (n <= 0 || isNaN(n) || !Number.isInteger(n)) return undefined;
    if (n >= 1) return (this.initialCustomers - 1) * this.serviceTime;
  }

  graphMaxTime(): number {
    return Math.ceil(Math.max(this.arrivalTime * 10, 10));
  }
}

export default Dd1kLambdaEqualNew;
