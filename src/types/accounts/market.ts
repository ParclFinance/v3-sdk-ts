import { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi";
import { PreciseIntUi } from "./preciseMath";

export type Market = {
  settings: MarketSettings;
  accounting: MarketAccounting;
  id: number;
  exchange: UmiPublicKey;
  priceFeed: UmiPublicKey;
  status: number;
  bump: number;
  _padding: Uint8Array; // [u8; 10],
};

export type MarketAccounting = {
  weightedPositionPrice: bigint; // u128
  lastUtilizedLiquidationCapacity: bigint; // u128
  size: bigint; // u128
  skew: bigint; // i128
  weightedPositionFundingPerUnit: PreciseIntUi;
  lastFundingRate: PreciseIntUi;
  lastFundingPerUnit: PreciseIntUi;
  lastTimeFundingUpdated: bigint; // u64
  firstLiquidationEpochStartTime: bigint; // u64
  lastLiquidationEpochIndex: bigint; // u64
  lastTimeLiquidationCapacityUpdated: bigint; // u64
  _padding: Uint8Array; // [u8; 8],
};

export type MarketSettings = {
  minPositionMargin: bigint; // u128
  skewScale: bigint; // u128
  maxSideSize: bigint; // u128
  maxLiquidationLimitAccumulationMultiplier: bigint; // u64 // bps
  maxSecondsInLiquidationEpoch: bigint; // u64
  initialMarginRatio: number; // u32
  makerFeeRate: number; // u16
  takerFeeRate: number; // u16
  maxFundingVelocity: number; // u16
  liquidationFeeRate: number; // u16
  minInitialMarginRatio: number; // u16
  maintenanceMarginProportion: number; // u16
  maxLiquidationPd: number; // u16
  authorizedLiquidator: UmiPublicKey;
  _padding: Uint8Array; // [u8; 14],
};
