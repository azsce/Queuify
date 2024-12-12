/* eslint-disable @typescript-eslint/no-unused-vars */
import Dd1kLambdaExceedNew from "./Dd1kLambdaExceedNew";

class Dd1kLambdaMultipleAndExceedNew extends Dd1kLambdaExceedNew {
  constructor(arrivalRate: number, serviceRate: number, capacity: number) {
    super(arrivalRate, serviceRate, capacity);
    this.type = "(λ > μ) && λ%μ = 0";
  }

  computeNOfTAtSteadyState(t: number): number {
    return this.capacity - 1;
  }

  waitingTimeForNthCustomerAtSteadyState(n: number): number {
    return (
      (this.serviceTime - 1 / this.arrivalRate) *
      (this.arrivalRate * this.firstBalkTime - 2)
    );
  }
}

export default Dd1kLambdaMultipleAndExceedNew;
