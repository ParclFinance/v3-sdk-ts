import {
  MarginAccount,
  Position,
  MarketMap,
  PriceFeedMap,
  Margins,
  PnLInfo,
  Address,
} from "../types";
import { ExchangeWrapper } from "./exchange";
import { PreciseIntWrapper } from "./preciseMath";
import { PRICE_EXPO, SIZE_EXPO } from "../constants";

export class MarginAccountWrapper {
  constructor(public marginAccount: MarginAccount, public address?: Address) {}

  positions(): PositionWrapper[] {
    const positions = [];
    for (const position of this.marginAccount.positions) {
      if (position.size == BigInt(0)) {
        continue;
      }
      positions.push(new PositionWrapper(position));
    }
    return positions;
  }

  margin(collateralExpo: number): PreciseIntWrapper {
    return PreciseIntWrapper.fromDecimal(this.marginAccount.margin, collateralExpo);
  }

  inLiquidation(): boolean {
    return this.marginAccount.inLiquidation == 1;
  }

  getAccountMargins(
    exchange: ExchangeWrapper,
    markets: MarketMap,
    priceFeeds: PriceFeedMap,
    now: number
  ): MarginsWrapper {
    let totalPnl = PreciseIntWrapper.zero();
    let requiredInitialMargin = PreciseIntWrapper.zero();
    let requiredMaintenanceMargin = PreciseIntWrapper.zero();
    let accumulatedLiquidationFees = PreciseIntWrapper.zero();
    // NOTE: positions method filters out empty positions
    for (const position of this.positions()) {
      const market = markets[position.marketId()];
      const priceFeed = priceFeeds[market.priceFeed().toBase58()];
      const isPythV2 = "priceMessage" in priceFeed;
      const priceInfo = isPythV2
        ? {
            price: BigInt(priceFeed.priceMessage.price.toString()),
            expo: priceFeed.priceMessage.exponent,
          }
        : { price: priceFeed.aggregate.price, expo: 0 };
      const indexPrice = PreciseIntWrapper.fromDecimal(priceInfo.price, priceInfo.expo);
      const {
        initialMargin: positionInitialMargin,
        maintenanceMargin: positionMaintenanceMargin,
        liquidationMargin: positionLiquidationMargin,
      } = market.getPositionRequiredMargins(position.size(), indexPrice, exchange.collateralExpo());
      const nextFunding = market.getFundingPerUnit(
        indexPrice,
        PreciseIntWrapper.fromDecimal(now, 0)
      );
      const pnlInfo = position.getPnl(indexPrice, nextFunding);
      totalPnl = totalPnl.add(pnlInfo.pnl);
      requiredInitialMargin = requiredInitialMargin.add(positionInitialMargin);
      requiredMaintenanceMargin = requiredMaintenanceMargin.add(positionMaintenanceMargin);
      accumulatedLiquidationFees = accumulatedLiquidationFees.add(positionLiquidationMargin);
    }
    const availableMargin = this.margin(exchange.collateralExpo()).add(totalPnl);
    const requiredLiquidationFeeMargin = exchange.getMinLiquidationFee(accumulatedLiquidationFees);
    return new MarginsWrapper({
      availableMargin,
      requiredInitialMargin,
      requiredMaintenanceMargin,
      requiredLiquidationFeeMargin,
      accumulatedLiquidationFees,
    });
  }
}

export class PositionWrapper {
  constructor(public position: Position) {}

  marketId(): number {
    return this.position.marketId;
  }

  size(): PreciseIntWrapper {
    return PreciseIntWrapper.fromDecimal(this.position.size, SIZE_EXPO);
  }

  lastInteractionFundingPerUnit(): PreciseIntWrapper {
    return new PreciseIntWrapper(this.position.lastInteractionFundingPerUnit);
  }

  getPnl(price: PreciseIntWrapper, nextFunding: PreciseIntWrapper): PnLInfo {
    const positionSize = PreciseIntWrapper.fromDecimal(this.position.size, SIZE_EXPO);
    const netFundingPerUnit = nextFunding.sub(this.lastInteractionFundingPerUnit());
    const accruedFunding = positionSize.mul(netFundingPerUnit);
    const priceDelta = price.sub(
      PreciseIntWrapper.fromDecimal(this.position.lastInteractionPrice, PRICE_EXPO)
    );
    const priceComponent = positionSize.mul(priceDelta);
    const pnl = priceComponent.add(accruedFunding);
    return {
      pnl,
      priceComponent,
      accruedFunding,
      netFundingPerUnit,
    };
  }
}

export class MarginsWrapper {
  constructor(public margins: Margins) {}

  totalRequiredMargin(): PreciseIntWrapper {
    return this.margins.requiredMaintenanceMargin.add(this.margins.requiredLiquidationFeeMargin);
  }

  canLiquidate(): boolean {
    return this.totalRequiredMargin().gt(this.margins.availableMargin);
  }
}
