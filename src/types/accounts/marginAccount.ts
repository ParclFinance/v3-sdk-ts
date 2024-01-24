import { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi";
import { PreciseIntUi } from "./preciseMath";

export type MarginAccount = {
  positions: Position[]; // [Position; 12]
  margin: bigint; // u64
  maxLiquidationFee: bigint; // u64
  id: number; // u32
  exchange: UmiPublicKey;
  owner: UmiPublicKey;
  delegate: UmiPublicKey;
  inLiquidation: number; // u8
  bump: number; // u8
  _padding: Uint8Array; // [u8; 10],
};

export type Position = {
  size: bigint; // i128
  lastInteractionPrice: bigint; // u128
  lastInteractionFundingPerUnit: PreciseIntUi;
  marketId: number; // u32
  _padding: Uint8Array; // [u8; 4],
};
