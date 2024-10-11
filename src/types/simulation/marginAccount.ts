import { PriceData as PythPriceData } from "@pythnetwork/client";
import { PriceUpdateAccount as PythV2PriceUpdateAccount } from "@pythnetwork/pyth-solana-receiver/lib/PythSolanaReceiver";
import { MarketWrapper, PreciseIntWrapper } from "../../simulation";

export type MarketMap = { [key: number]: MarketWrapper };

export type PriceFeedMap = { [key: string]: PythPriceFeed };

export type PythPriceFeed = PythPriceData | PythV2PriceUpdateAccount;

export type Margins = {
  availableMargin: PreciseIntWrapper;
  requiredInitialMargin: PreciseIntWrapper;
  requiredMaintenanceMargin: PreciseIntWrapper;
  requiredLiquidationFeeMargin: PreciseIntWrapper;
  accumulatedLiquidationFees: PreciseIntWrapper;
};

export type PositionMargins = {
  initialMargin: PreciseIntWrapper;
  maintenanceMargin: PreciseIntWrapper;
  liquidationMargin: PreciseIntWrapper;
  initialMarginRatio: PreciseIntWrapper;
  maintenanceMarginRatio: PreciseIntWrapper;
};

export type PnLInfo = {
  pnl: PreciseIntWrapper;
  priceComponent: PreciseIntWrapper;
  accruedFunding: PreciseIntWrapper;
  netFundingPerUnit: PreciseIntWrapper;
};
