import { dd1k } from "../lib/dd1k";

test("findFirstBalkTime returns correct t_i for capacity=5, serviceRate=1/6, arrivalRate=1/4", () => {
  const arrivalRate = 1 / 4;
  const serviceRate = 1 / 6;
  const capacity = 5;
  const result = dd1k(arrivalRate, serviceRate, capacity);
  expect(result.t1).toBe(44); // Expected t_i is 44 based on the calculation
});
