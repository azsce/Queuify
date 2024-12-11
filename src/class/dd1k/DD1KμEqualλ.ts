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
      this.initialCustomers * (this.serviceTime);
  }

  computeNOfT(initialCustomers) {
    return initialCustomers;
  }

  waitingTimeForNthCustomer(n: number) {
    return (this.initialCustomers - 1) / (1 * this.serviceRate);
  }

  isServiceCompletion(t: number): boolean {
    return t > 0 && t % this.serviceTime === 0;
  }

  canCustomerEnterSystem(t: number): boolean {
    return true;
  }

  getServiceEventAtTime(t: number): {
    entersService: boolean;
    isInitial: boolean;
    customerIndex: string;
  } {
    if (t < this.lastInitialCustomerDepartureTime) {
      if (t % (this.serviceTime) === 0) {
        return {
          entersService: true,
          isInitial: true,
          customerIndex: `M${Math.floor(t * this.serviceRate) + 1}`,
        };
      }
    } else if (t <= this.transientTime) {
      const n = this.computeNOfT(t);
      if (n > 0) {
        return {
          entersService: true,
          isInitial: false,
          customerIndex: `C${Math.floor(t * this.serviceRate) + 1 - this.initialCustomers}`,
        };
      }
    } else if (t % (1 / this.arrivalRate) === 0) {
      return {
        entersService: true,
        isInitial: false,
        customerIndex: `C${Math.floor(t * this.serviceRate) + 1 - this.initialCustomers}`,
      };
    }

    return {
      entersService: false,
      isInitial: false,
      customerIndex: "",
    };
  }

  generateServiceTimelineData(
    xAxisMax?: number
  ): Array<{
    time: string;
    service: number;
    customerIndex: string;
    key: number;
  }> {

    const maxTime = xAxisMax ?? this.graphMaxTime();

    const data = [];
    let currentCustomer = 1;
    let t = 0;
    let key = 0;

    while (t <= maxTime) {
      const serviceEvent = this.getServiceEventAtTime(t);

      if (serviceEvent.entersService) {
        data.push({
          time: Math.round(t),
          service: currentCustomer,
          customerIndex: serviceEvent.customerIndex,
          isInitialCustomer: serviceEvent.isInitial,
          key: key++,
        });
        currentCustomer++;
      } 
      else {
        data.push({
          time: Math.round(t),
          service: 0,
          customerIndex: "",
          isInitialCustomer: false,
          key: key++,
        });
      }

      t += 1 / this.serviceRate;
    }

    return data;
  }

  graphMaxTime(): number {
    return Math.ceil(Math.max((1 / this.arrivalRate) * 10, 10));
  }
}

export default DD1KμEqualλ;
