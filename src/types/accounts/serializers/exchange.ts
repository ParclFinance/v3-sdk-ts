import {
  Serializer,
  struct,
  bytes,
  publicKey,
  array,
  u8,
  u16,
  i16,
  u32,
  u64,
  u128,
  i128,
} from "@metaplex-foundation/umi/serializers";
import { Exchange, ExchangeOracleConfig, ExchangeAccounting, ExchangeSettings } from "..";

const exchangeOracleConfigSerializer: Serializer<ExchangeOracleConfig> = struct([
  ["kind", u32()],
  ["programId", publicKey()],
]);

const exchangeAccountingSerializer: Serializer<ExchangeAccounting> = struct([
  ["notionalOpenInterest", u128()],
  ["unrealizedPnl", i128()],
  ["lastTimeLockedOpenInterestAccountingRefreshed", u64()],
  ["balance", u64()],
  ["marginBalance", u64()],
  ["lpBalance", u64()],
  ["lpShares", u64()],
  ["protocolFees", u64()],
  ["unsettledCollateralAmount", u64()],
  ["_padding", bytes({ size: 8 })],
]);

const exchangeSettingsSerializer: Serializer<ExchangeSettings> = struct([
  ["minLpDuration", u64()],
  ["settlementDelay", u64()],
  ["minLiquidationFee", u64()],
  ["maxLiquidationFee", u64()],
  ["lockedOpenInterestStalenessThreshold", u64()],
  ["protocolFeeRate", u16()],
  ["lockedOpenInterestRatio", u16()],
  ["maxKeeperTipRate", u16()],
  ["_padding", bytes({ size: 2 })],
]);

export const exchangeSerializer: Serializer<Exchange> = struct([
  ["accounting", exchangeAccountingSerializer],
  ["settings", exchangeSettingsSerializer],
  ["id", u64()],
  ["marketIds", array(u32(), { size: 62 })],
  ["oracleConfigs", array(exchangeOracleConfigSerializer, { size: 10 })],
  ["status", u16()],
  ["collateralExpo", i16()],
  ["collateralMint", publicKey()],
  ["collateralVault", publicKey()],
  ["admin", publicKey()],
  ["nominatedAdmin", publicKey()],
  ["authorizedSettler", publicKey()],
  ["authorizedProtocolFeesCollector", publicKey()],
  ["bump", u8()],
  ["idSeed", bytes({ size: 8 })],
  ["_padding", bytes({ size: 11 })],
]);
