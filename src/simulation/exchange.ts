import { Address, Exchange } from "../types";
import { PreciseIntWrapper } from "./preciseMath";

export class ExchangeWrapper {
  constructor(public exchange: Exchange, public address?: Address) {}

  collateralExpo(): number {
    return this.exchange.collateralExpo;
  }

  getMinLiquidationFee(accumulatedLiquidationFees: PreciseIntWrapper): PreciseIntWrapper {
    if (accumulatedLiquidationFees.isZero()) {
      return PreciseIntWrapper.zero();
    }
    const minLiquidationFee = PreciseIntWrapper.fromDecimal(
      this.exchange.settings.minLiquidationFee,
      this.exchange.collateralExpo
    );
    return accumulatedLiquidationFees.min(minLiquidationFee);
  }
}
