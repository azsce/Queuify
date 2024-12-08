import { Fraction } from "./math";

export type DD1KCharacteristics = {
  type: DD1KType;
  arrivalRate: number;
  serviceRate: number;
  capacity: number;
  arrivalRateFraction: Fraction;
  serviceRateFraction: Fraction;
  t_i: number;
};

export type DD1KType = "λ > μ" | "(λ > μ) && λ%μ = 0";

export type N_Of_T = {
  t_lessThan_arrivalTime: string; // t < 1/λ
  t_between_arrivalTime_and_ti: string; // 1/λ ≤ t < t_i
  t_greaterOrEqual_ti: string; // t ≥ t_i
};

export type Wq_Of_N = {
  n0: string; // n = 0
  n_LessThan_LambdaTi: string; // n < λ*t_i
  nGreaterThanOrEqualLambdaTi: string; // n ≥ λ*t_i
};


enum WhichCase {
  LAMBDA_GT_MU = "λ > μ",
  LAMBDA_GT_MU_DIVISIBLE = "(λ > μ) && λ%μ = 0",
}