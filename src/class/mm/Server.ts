import { exponentialRandom } from "@/lib/math";
import Customer from "./Customer";

class Server {
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
    if (this.isIdle) {
      this.totalIdleTime += currentTime - this.lastIdleStartTime;
    }
    this.isIdle = false;
    this.currentCustomer = customer;
    customer.serviceStartTime = currentTime;
    const serviceTime = exponentialRandom(serviceRate);
    this.finishTime = currentTime + serviceTime;
    return serviceTime;
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

export default Server;