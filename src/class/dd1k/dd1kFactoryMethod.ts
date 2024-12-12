import Dd1k from "./Dd1k";
import Dd1kLambdaExceedNew from "./Dd1kLambdaExceedNew";
import Dd1kLambdaMultipleAndExceedNew from "./Dd1kLambdaMultipleAndExceedNew";
import Dd1kLambdaEqualNew from "./Dd1kLambdaEqualNew";
import Dd1kNewExceedLambda from "./Dd1kNewExceedLambda";

/**
 * @param arrivalRate - The rate at which customers arrive.
 * @param serviceRate - The rate at which customers are served.
 * @param capacity - The maximum number of customers the system can hold.
 * @param initialCustomers - The number of customers in the system at time t = 0.
 *
 * @returns An instance of the D/D/1/(k-1) queue system.
 */
export default function dd1kFactoryMethod(
  arrivalRate: number,
  serviceRate: number,
  capacity: number,
  initialCustomers?: number
): Dd1k {
  if (arrivalRate > serviceRate) {
    if (arrivalRate % serviceRate === 0) {
      // λ > μ and λ%μ = 0
      return new Dd1kLambdaMultipleAndExceedNew(arrivalRate, serviceRate, capacity);
    }
    // λ > μ
    return new Dd1kLambdaExceedNew(arrivalRate, serviceRate, capacity);
  } else if (arrivalRate === serviceRate) {
    // λ = μ
    return new Dd1kLambdaEqualNew(
      arrivalRate,
      serviceRate,
      capacity,
      initialCustomers
    );
  } else {
    // λ < μ
    return new Dd1kNewExceedLambda(
      arrivalRate,
      serviceRate,
      capacity,
      initialCustomers
    );
  }
}
