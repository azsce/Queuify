/* eslint-disable @typescript-eslint/no-unused-vars */

import DD1K from "./DD1K";
import { toProperFraction } from "@/lib/math";

class DD1KμEqualλ extends DD1K {
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
  }

  computeNOfT(initialCustomers) {
    return initialCustomers;
  }

  waitingTimeForNthCustomer(n: number) {
    return (this.initialCustomers - 1) / (1 * this.serviceRate);
  }

  isServiceCompletion(t: number): boolean {
    return false;
  }

  canCustomerEnterSystem(t: number): boolean {
    return false;
  }

  getServiceEventAtTime(t: number): { entersService: boolean; isInitial: boolean; customerIndex: string } {
    throw new Error("Method not implemented.");
  }

  generateServiceTimelineData(
    xAxisMax?: number
  ): Array<{ time: string; service: number; customerIndex: string }> {
    const data = [];
    let customerIndex = 0;
    let service = 0;
    let time = 0;

    while (time < xAxisMax) {
      data.push({
        time: time.toString(),
        service,
        customerIndex: customerIndex.toString(),
      });
      time += this.serviceTime;
      service = 1;
      customerIndex += 1;
    }

    return data;
  }

  graphMaxTime(): number {
    return Math.ceil(Math.max(1/this.arrivalRate * 10, 10));
  }
}

export default DD1KμEqualλ;
