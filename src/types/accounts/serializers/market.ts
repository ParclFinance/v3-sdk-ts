import {
  Serializer,
  struct,
  bytes,
  publicKey,
  u16,
  u32,
  u8,
  u64,
  u128,
  i128,
} from "@metaplex-foundation/umi/serializers";
import { PreciseIntToDecimalsSerializer } from "./preciseMath";
import { Market, MarketSettings, MarketAccounting } from "..";

const marketAccountingSerializer: Serializer<MarketAccounting> = struct([
  ["weightedPositionPrice", u128()],
  ["lastUtilizedLiquidationCapacity", u128()],
  ["size", u128()],
  ["skew", i128()],
  ["weightedPositionFundingPerUnit", PreciseIntToDecimalsSerializer],
  ["lastFundingRate", PreciseIntToDecimalsSerializer],
  ["lastFundingPerUnit", PreciseIntToDecimalsSerializer],
  ["lastTimeFundingUpdated", u64()],
  ["firstLiquidationEpochStartTime", u64()],
  ["lastLiquidationEpochIndex", u64()],
  ["lastTimeLiquidationCapacityUpdated", u64()],
  ["_padding", bytes({ size: 8 })],
]);

const marketSettingsSerializer: Serializer<MarketSettings> = struct([
  ["minPositionMargin", u128()],
  ["skewScale", u128()],
  ["maxSideSize", u128()],
  ["maxLiquidationLimitAccumulationMultiplier", u64()],
  ["maxSecondsInLiquidationEpoch", u64()],
  ["initialMarginRatio", u32()],
  ["makerFeeRate", u16()],
  ["takerFeeRate", u16()],
  ["maxFundingVelocity", u16()],
  ["liquidationFeeRate", u16()],
  ["minInitialMarginRatio", u16()],
  ["maintenanceMarginProportion", u16()],
  ["maxLiquidationPd", u16()],
  ["authorizedLiquidator", publicKey()],
  ["_padding", bytes({ size: 14 })],
]);

export const marketSerializer: Serializer<Market> = struct([
  ["settings", marketSettingsSerializer],
  ["accounting", marketAccountingSerializer],
  ["id", u32()],
  ["exchange", publicKey()],
  ["priceFeed", publicKey()],
  ["status", u8()],
  ["bump", u8()],
  ["_padding", bytes({ size: 10 })],
]);
