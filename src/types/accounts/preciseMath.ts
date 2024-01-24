import Decimal from "decimal.js";

export type PreciseIntUi = Decimal;

export type PreciseUintUi = Decimal;

export type PreciseUint = [[Uint]];

export type PreciseInt = [[Uint]];

export type Uint = {
  limbs: bigint[];
};
