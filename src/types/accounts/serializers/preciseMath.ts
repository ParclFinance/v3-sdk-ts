import {
  Serializer,
  mapSerializer,
  struct,
  array,
  tuple,
  u64,
} from "@metaplex-foundation/umi/serializers";
import Decimal from "decimal.js";
import { PreciseUint, PreciseInt, Uint } from "../preciseMath";

const UINT_LIMBS_SIZE = 3;
const BASE = new Decimal(2).pow(64);
const SIGN_BIT = BigInt(1) << BigInt(63);

export const UintSerializer: Serializer<Uint> = struct([
  ["limbs", array(u64(), { size: UINT_LIMBS_SIZE })],
]);

export const PreciseUintSerializer: Serializer<PreciseUint> = tuple([tuple([UintSerializer])]);

export const PreciseIntSerializer: Serializer<PreciseInt> = tuple([tuple([UintSerializer])]);

export const PreciseUintToDecimalsSerializer: Serializer<Decimal> = mapSerializer(
  PreciseUintSerializer,
  decimalToPreciseUint,
  preciseUintToDecimal
);

export function preciseUintToDecimal(preciseUint: PreciseUint): Decimal {
  const limbs = preciseUint[0][0].limbs;
  let result = new Decimal(0);
  for (let i = limbs.length - 1; i >= 0; i--) {
    result = result.mul(BASE).add(new Decimal(limbs[i].toString()));
  }
  return result;
}

// TODO:
export function decimalToPreciseUint(decimal: Decimal): PreciseInt {
  decimal;
  return [[{ limbs: [] }]];
}

export const PreciseIntToDecimalsSerializer: Serializer<Decimal> = mapSerializer(
  PreciseIntSerializer,
  decimalToPreciseInt,
  preciseIntToDecimal
);

export function preciseIntToDecimal(preciseInt: PreciseInt): Decimal {
  let limbs = preciseInt[0][0].limbs;
  const mostSignificantLimb = limbs[limbs.length - 1];
  const isNegative = (mostSignificantLimb & SIGN_BIT) !== BigInt(0);
  let result = new Decimal(0);
  if (isNegative) {
    limbs = addOneToLimbs(limbs.map((limb) => ~limb));
  }
  for (let i = limbs.length - 1; i >= 0; i--) {
    result = result.mul(BASE).add(new Decimal(limbs[i].toString()));
  }
  if (isNegative) {
    result = result.negated();
  }
  return result;
}

// TODO:
export function decimalToPreciseInt(decimal: Decimal): PreciseInt {
  decimal;
  return [[{ limbs: [] }]];
}

function addOneToLimbs(limbs: bigint[]): bigint[] {
  const result = [];
  let carry = BigInt(1);
  for (const limb of limbs) {
    const sum = limb + carry;
    carry = sum > BigInt("0xFFFFFFFFFFFFFFFF") ? BigInt(1) : BigInt(0);
    result.push(sum & BigInt("0xFFFFFFFFFFFFFFFF"));
  }
  if (carry > 0 && result.length < limbs.length) {
    result.push(carry);
  }
  return result;
}
