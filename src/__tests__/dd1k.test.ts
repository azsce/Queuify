import { dd1k } from '../lib/dd1k';

test('calculate first balk time correctly', () => {
  const arrivalRate = 4;
  const serviceRate = 6;
  const capacity = 10;
  const result = dd1k(arrivalRate, serviceRate, capacity);
  expect(result.t1).toBeCloseTo(44, 1);
});

