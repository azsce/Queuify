import { mm } from "@/lib/mm";
import { MMCharacteristics } from "@/types/mm";

describe("mm function", () => {
  it("should return correct MMCharacteristics when serviceRate = 60, arrivalRate = 50, servers = 1, and capacity undefined", () => {
    const serviceRate = 60;
    const arrivalRate = 50;
    const servers = 1;
    const capacity = null;

    const expectedRho = 5 / 6;
    const expectedP0 = 1 / 6;
    const expectedL = 5;
    const expectedLq = 25 / 6;
    const expectedW = 1 / 10;
    const expectedWq = 1 / 12;

    const result = mm(60, 50, 1);
    const expected: MMCharacteristics = {
      validSystem: true,
      servers: 1,
      capacity: undefined,
      serviceRate: 60,
      arrivalRate: 50,
      rho: 50 / 60,
      P0: 1 - 50 / 60,
      L: 5,
      Lq: 5 - (1 - (1 - 50 / 60)),
      W: 5 / 50,
      Wq: (5 - (1 - (1 - 50 / 60))) / 50,
    };

    const precision = 6; // Define the precision for comparison

    expect(result.L.toFixed(precision)).toEqual(expected.L.toFixed(precision));
    expect(result.Lq.toFixed(precision)).toEqual(
      expected.Lq.toFixed(precision)
    );
    expect(result.P0.toFixed(precision)).toEqual(
      expected.P0.toFixed(precision)
    );
    expect(result.W.toFixed(precision)).toEqual(expected.W.toFixed(precision));
    expect(result.Wq.toFixed(precision)).toEqual(
      expected.Wq.toFixed(precision)
    );
  });
});
