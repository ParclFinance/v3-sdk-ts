import { Decimal } from "decimal.js";
import { PRICE_EXPO, SIZE_EXPO } from "../constants";
import { U64 } from "../types";

export function parseCollateralAmount(collateralAmount: number | string, expo: number): U64 {
  if (expo < 0) {
    throw new Error("parseAmount only accepts positive expo argument");
  }
  return BigInt(parseAmount(collateralAmount, expo));
}

export function parseSize(size: number | string): U64 {
  return BigInt(parseAmount(size, Math.abs(SIZE_EXPO)));
}

export function parsePrice(price: number | string): U64 {
  return BigInt(parseAmount(price, Math.abs(PRICE_EXPO)));
}

// expo must be positive
function parseAmount(amount: number | string, expo: number): string {
  return new Decimal(amount)
    .mul(10 ** expo)
    .floor()
    .toString();
}
