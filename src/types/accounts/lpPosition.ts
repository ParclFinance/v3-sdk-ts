import { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi";

export type LpPosition = {
  id: bigint; // u64
  liquidity: bigint; // u64
  shares: bigint; // u64
  maturity: bigint; // u64
  exchange: UmiPublicKey;
  owner: UmiPublicKey;
  bump: number; // u8
  _padding: Uint8Array; // [u8; 7],
};
