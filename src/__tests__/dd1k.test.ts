// ...existing code...

import { DD1KλExceedμ } from "@/class/dd1k/dd1k";

describe("DD1KλExceedμ", () => {
  describe("findFirstBalkTime", () => {
    it("should find correct t_i for λ=1/4, μ=1/6, k=5", () => {
      const lambda = 1 / 4; // arrival rate
      const mu = 1 / 6; // service rate
      const k = 5; // capacity

      const t_i = DD1KλExceedμ.findFirstBalkTime(lambda, mu, k, "λ > μ");

      expect(t_i).toBe(44);
    });
  });
});

// ...existing code...
