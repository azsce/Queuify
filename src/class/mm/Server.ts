import { exponentialRandom, roundTo4Decimals } from "@/lib/math";
import { Customer } from "@/types/Simulation";

class QueueServer {
  id: number;
  isIdle: boolean;
  finishTime: number;
  currentCustomer?: Customer;
  totalIdleTime: number;
  lastIdleStartTime: number;

  constructor(id: number) {
    this.id = id;
    this.isIdle = true;
    this.finishTime = Infinity;
    this.totalIdleTime = 0;
    this.lastIdleStartTime = 0;
  }

  serveCustomer(currentTime: number, serviceRate: number, customer: Customer) {
    if (serviceRate <= 0) {
      throw new Error("Service rate must be positive and non-zero");
    }
    if (this.isIdle) {
      this.totalIdleTime += currentTime - this.lastIdleStartTime;
    }
    this.isIdle = false;
    this.currentCustomer = customer;
    customer.serviceStartTime = roundTo4Decimals(currentTime);
    const serviceTime = exponentialRandom(serviceRate);
    if (isFinite(serviceTime) && serviceTime > 0) {
      this.finishTime = roundTo4Decimals(currentTime + serviceTime);
      return serviceTime;
    } else {
      console.error("Invalid service time:", serviceTime);
      this.finishTime = roundTo4Decimals(currentTime); // Set finish time to current time to avoid Infinity
      return 0;
    }
  }

  finishService() {
    if (this.currentCustomer) {
      this.currentCustomer.departureTime = this.finishTime;
      this.currentCustomer.waitingInQueueTime = this.currentCustomer.serviceStartTime! - this.currentCustomer.arrivalTime;
      this.currentCustomer.waitingInSystemTime = this.currentCustomer.departureTime - this.currentCustomer.arrivalTime;
    }
    this.isIdle = true;
    this.lastIdleStartTime = this.finishTime;
    this.finishTime = Infinity;
    this.currentCustomer = undefined;
  }
}

export default QueueServer;