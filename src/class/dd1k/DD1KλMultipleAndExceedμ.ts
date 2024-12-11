/* eslint-disable @typescript-eslint/no-unused-vars */
import DD1KλExceedμ from "./DD1KλExceedμ";

class DD1KλMultipleAndExceedμ extends DD1KλExceedμ {
  constructor(arrivalRate: number, serviceRate: number, capacity: number) {
    super(arrivalRate, serviceRate, capacity);
    this.type = "(λ > μ) && λ%μ = 0";
  }

  computeNOfTAtSteadyState(t: number): number {
    return this.capacity - 1;
  }

  waitingTimeForNthCustomerAtSteadyState(n: number): number {
    return (
      (1 / this.serviceRate - 1 / this.arrivalRate) *
      (this.arrivalRate * this.firstBalkTime - 2)
    );
  }
}

export default DD1KλMultipleAndExceedμ;
