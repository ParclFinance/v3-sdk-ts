import Decimal from "decimal.js";
import { PRECISION } from "../constants";

const PRECISE_NUM_ONE = new Decimal(1_000_000_000_000_000);

export class PreciseIntWrapper {
  val: Decimal;

  constructor(preciseInt: Decimal) {
    this.val = preciseInt;
  }

  static zero(): PreciseIntWrapper {
    return new PreciseIntWrapper(new Decimal(0));
  }

  static fromDecimal(val: bigint | number, expo: number): PreciseIntWrapper {
    const precision = PRECISION + expo;
    const precisionScaled = new Decimal(10).pow(Math.abs(precision));
    return new PreciseIntWrapper(
      precision < 0
        ? new Decimal(val.toString()).div(precisionScaled)
        : new Decimal(val.toString()).mul(precisionScaled)
    );
  }

  add(rhs: PreciseIntWrapper): PreciseIntWrapper {
    return new PreciseIntWrapper(this.val.add(rhs.val));
  }

  sub(rhs: PreciseIntWrapper): PreciseIntWrapper {
    return new PreciseIntWrapper(this.val.sub(rhs.val));
  }

  mul(rhs: PreciseIntWrapper): PreciseIntWrapper {
    return new PreciseIntWrapper(this.val.mul(rhs.val).div(PRECISE_NUM_ONE));
  }

  gt(rhs: PreciseIntWrapper): boolean {
    return this.val.gt(rhs.val);
  }

  lt(rhs: PreciseIntWrapper): boolean {
    return this.val.lt(rhs.val);
  }

  div(rhs: PreciseIntWrapper): PreciseIntWrapper {
    return new PreciseIntWrapper(this.val.mul(PRECISE_NUM_ONE).div(rhs.val));
  }

  min(rhs: PreciseIntWrapper): PreciseIntWrapper {
    return new PreciseIntWrapper(Decimal.min(this.val, rhs.val));
  }

  max(rhs: PreciseIntWrapper): PreciseIntWrapper {
    return new PreciseIntWrapper(Decimal.max(this.val, rhs.val));
  }

  isZero(): boolean {
    return this.val.isZero();
  }

  neg(): this {
    this.val = this.val.neg();
    return this;
  }

  abs(): this {
    this.val = this.val.abs();
    return this;
  }

  clamp(min: PreciseIntWrapper, max: PreciseIntWrapper): PreciseIntWrapper {
    return new PreciseIntWrapper(Decimal.min(Decimal.max(this.val, min.val), max.val));
  }
}
