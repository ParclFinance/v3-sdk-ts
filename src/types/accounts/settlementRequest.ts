import { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi";

export type SettlementRequest = {
  id: bigint; // u64
  maturity: bigint; // u64
  amount: bigint; // u64
  keeperTip: bigint; // u64
  exchange: UmiPublicKey;
  owner: UmiPublicKey;
  ownerTokenAccount: UmiPublicKey;
  bump: number; // u8
  _padding: Uint8Array; // [u8; 7],
};
