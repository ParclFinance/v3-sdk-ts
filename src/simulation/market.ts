import { PublicKey } from "@solana/web3.js";
import { Address, Market, PositionMargins } from "../types";
import { PreciseIntWrapper } from "./preciseMath";
import { SIZE_EXPO, BPS_EXPO } from "../constants";

export class MarketWrapper {
  constructor(public market: Market, public address?: Address) {}

  priceFeed(): PublicKey {
    return new PublicKey(this.market.priceFeed);
  }

  lastFundingRate(): PreciseIntWrapper {
    return new PreciseIntWrapper(this.market.accounting.lastFundingRate);
  }

  lastFundingPerUnit(): PreciseIntWrapper {
    return new PreciseIntWrapper(this.market.accounting.lastFundingPerUnit);
  }

  getFundingRate(now: PreciseIntWrapper): PreciseIntWrapper {
    return this.lastFundingRate().add(
      this.getCurrentFundingVelocity().mul(this.getProportionalElapsedTime(now))
    );
  }

  getProportionalElapsedTime(now: PreciseIntWrapper): PreciseIntWrapper {
    return now
      .sub(PreciseIntWrapper.fromDecimal(this.market.accounting.lastTimeFundingUpdated, 0))
      .div(PreciseIntWrapper.fromDecimal(86_400, 0));
  }

  getCurrentFundingVelocity(): PreciseIntWrapper {
    const skewScale = PreciseIntWrapper.fromDecimal(this.market.settings.skewScale, SIZE_EXPO);
    if (skewScale.isZero()) {
      return PreciseIntWrapper.zero();
    }
    const proportionalSkew = PreciseIntWrapper.fromDecimal(
      this.market.accounting.skew,
      SIZE_EXPO
    ).div(skewScale);
    return proportionalSkew
      .clamp(PreciseIntWrapper.fromDecimal(1, 0).neg(), PreciseIntWrapper.fromDecimal(1, 0))
      .mul(PreciseIntWrapper.fromDecimal(this.market.settings.maxFundingVelocity, SIZE_EXPO));
  }

  getFundingPerUnit(price: PreciseIntWrapper, now: PreciseIntWrapper): PreciseIntWrapper {
    const unrecordedFundingPerUnit = this.getUnrecordedFundingPerUnit(price, now);
    return this.lastFundingPerUnit().add(unrecordedFundingPerUnit);
  }

  getUnrecordedFundingPerUnit(price: PreciseIntWrapper, now: PreciseIntWrapper): PreciseIntWrapper {
    const fundingRate = this.getFundingRate(now);
    const avgFundingRate = this.lastFundingRate()
      .add(fundingRate)
      .div(PreciseIntWrapper.fromDecimal(2, 0));
    return avgFundingRate
      .neg() // flip funding rate sign so funding per unit's sign matches flow's sign
      .mul(this.getProportionalElapsedTime(now))
      .mul(price);
  }

  getPositionRequiredMargins(
    positionSize: PreciseIntWrapper,
    indexPrice: PreciseIntWrapper,
    collateralExpo: number
  ): PositionMargins {
    if (positionSize.isZero()) {
      return {
        initialMargin: PreciseIntWrapper.zero(),
        maintenanceMargin: PreciseIntWrapper.zero(),
        liquidationMargin: PreciseIntWrapper.zero(),
        initialMarginRatio: PreciseIntWrapper.zero(),
        maintenanceMarginRatio: PreciseIntWrapper.zero(),
      };
    }
    const skewScale = PreciseIntWrapper.fromDecimal(this.market.settings.skewScale, SIZE_EXPO);
    const initialMarginRatio = skewScale.isZero()
      ? PreciseIntWrapper.zero()
      : positionSize
          .abs()
          .div(skewScale)
          .mul(PreciseIntWrapper.fromDecimal(this.market.settings.initialMarginRatio, BPS_EXPO))
          .add(PreciseIntWrapper.fromDecimal(this.market.settings.minInitialMarginRatio, BPS_EXPO));
    const maintenanceMarginRatio = initialMarginRatio.mul(
      PreciseIntWrapper.fromDecimal(this.market.settings.maintenanceMarginProportion, BPS_EXPO)
    );
    const notional = positionSize.mul(indexPrice);
    const minPositionMargin = PreciseIntWrapper.fromDecimal(
      this.market.settings.minPositionMargin,
      collateralExpo
    );
    const initialMargin = notional.mul(initialMarginRatio).add(minPositionMargin);
    const maintenanceMargin = notional.mul(maintenanceMarginRatio).add(minPositionMargin);
    const liquidationMargin = notional.mul(
      PreciseIntWrapper.fromDecimal(this.market.settings.liquidationFeeRate, BPS_EXPO)
    );
    return {
      initialMargin,
      maintenanceMargin,
      liquidationMargin,
      initialMarginRatio,
      maintenanceMarginRatio,
    };
  }
}
