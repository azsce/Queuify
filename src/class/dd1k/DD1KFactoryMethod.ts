import DD1K from "./DD1K";
import DD1KλExceedμ from "./DD1KλExceedμ";
import DD1KλMultipleAndExceedμ from "./DD1KλMultipleAndExceedμ";
import DD1KμEqualλ from "./DD1KμEqualλ";
import DD1KμExceedλ from "./DD1KμExceedλ";

/**
 * @param arrivalRate - The rate at which customers arrive.
 * @param serviceRate - The rate at which customers are served.
 * @param capacity - The maximum number of customers the system can hold.
 * @param initialCustomers - The number of customers in the system at time t = 0.
 *
 * @returns An instance of the D/D/1/(k-1) queue system.
 */
export default function dD1KFactoryMethod(
  arrivalRate: number,
  serviceRate: number,
  capacity: number,
  initialCustomers?: number
): DD1K {
  if (arrivalRate > serviceRate) {
    if (arrivalRate % serviceRate === 0) {
      console.log("dD1KFactoryMethod: λ > μ and λ%μ = 0");
      // λ > μ and λ%μ = 0
      return new DD1KλMultipleAndExceedμ(arrivalRate, serviceRate, capacity);
    }
    console.log("dD1KFactoryMethod: λ > μ and λ%μ != 0");
    // λ > μ
    return new DD1KλExceedμ(arrivalRate, serviceRate, capacity);
  } else if (arrivalRate === serviceRate) {
    console.log("dD1KFactoryMethod: λ = μ");
    // λ = μ
    return new DD1KμEqualλ(
      arrivalRate,
      serviceRate,
      capacity,
      initialCustomers
    );
  } else {
    console.log("dD1KFactoryMethod: λ < μ");
    // λ < μ
    return new DD1KμExceedλ(
      arrivalRate,
      serviceRate,
      capacity,
      initialCustomers
    );
  }
}
