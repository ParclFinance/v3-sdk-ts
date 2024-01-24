import { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi";

export type LpAccount = {
  liquidity: bigint; // u64
  shares: bigint; // u64
  lastAddLiquidityTimestamp: bigint; // u64
  exchange: UmiPublicKey;
  owner: UmiPublicKey;
  delegate: UmiPublicKey;
  bump: number; // u8
  _padding: Uint8Array; // [u8; 7],
};
