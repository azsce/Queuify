import { mm } from "@/lib/mm";
import { MMCharacteristics } from "@/types/mm";

describe("mm function", () => {
  it("should return correct MMCharacteristics when serviceRate = 60, arrivalRate = 50, servers = 1, and capacity undefined", () => {
    const serviceRate = 60;
    const arrivalRate = 50;
    const servers = 1;
    const capacity = undefined;

    const expectedRho = 5 / 6;
    const expectedP0 = 1 / 6;
    const expectedL = 5;
    const expectedLq = 25 / 6;
    const expectedW = 1 / 10;
    const expectedWq = 1 / 12;

    const result = mm(serviceRate, arrivalRate, servers);
    const expected: MMCharacteristics = {
      validSystem: true,
      servers: servers,
      capacity: capacity,
      serviceRate: serviceRate,
      arrivalRate: arrivalRate,
      rho: expectedRho,
      P0: expectedP0,
      L: expectedL,
      Lq: expectedLq,
      W: expectedW,
      Wq: expectedWq,
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
