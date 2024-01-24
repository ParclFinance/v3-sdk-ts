import { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi";

export type Exchange = {
  accounting: ExchangeAccounting;
  settings: ExchangeSettings;
  id: bigint; // u64
  marketIds: number[]; // [u32; 62]
  oracleConfigs: ExchangeOracleConfig[]; // [ExchangeOracleConfig; 10]
  status: number; // u16
  collateralExpo: number; // i16
  collateralMint: UmiPublicKey;
  collateralVault: UmiPublicKey;
  admin: UmiPublicKey;
  nominatedAdmin: UmiPublicKey;
  authorizedSettler: UmiPublicKey;
  authorizedProtocolFeesCollector: UmiPublicKey;
  bump: number;
  idSeed: Uint8Array; // [u8; 8],
  _padding: Uint8Array; // [u8; 11],
};

export type ExchangeOracleConfig = {
  kind: number; // u32,
  programId: UmiPublicKey;
};

export type ExchangeAccounting = {
  notionalOpenInterest: bigint; // u128
  unrealizedPnl: bigint; // i128
  lastTimeLockedOpenInterestAccountingRefreshed: bigint; // u64
  balance: bigint; // u64
  marginBalance: bigint; // u64
  lpBalance: bigint; // u64
  lpShares: bigint; // u64
  protocolFees: bigint; // u64
  unsettledCollateralAmount: bigint; // u64
  _padding: Uint8Array; // [u8; 8],
};

export type ExchangeSettings = {
  minLpDuration: bigint; // u64
  settlementDelay: bigint; // u64
  minLiquidationFee: bigint; // u64
  maxLiquidationFee: bigint; // u64
  lockedOpenInterestStalenessThreshold: bigint; // u64
  protocolFeeRate: number;
  lockedOpenInterestRatio: number;
  maxKeeperTipRate: number;
  _padding: Uint8Array; // [u8; 2],
};
