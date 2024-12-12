/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fraction } from "@/types/math";

/**
 * Converts a decimal number to a proper fraction.
 * @param decimal - The decimal number to convert.
 * @returns The fraction in the form of an object { numerator, denominator }.
 */
export function toProperFraction(decimal: number): Fraction {
  const tolerance = 1.0e-6;
  let h1 = 1,
    h2 = 0,
    k1 = 0,
    k2 = 1,
    b = decimal;
  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

  return { numerator: h1, denominator: k1 };
}

export const isValidPositiveValue = (value: any): boolean => {
  if (value <= 0 || isNaN(value) || value.value === null) return;
  return true;
};
