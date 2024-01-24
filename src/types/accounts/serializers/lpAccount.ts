import {
  Serializer,
  struct,
  bytes,
  publicKey,
  u8,
  u64,
} from "@metaplex-foundation/umi/serializers";
import { LpAccount } from "../lpAccount";

export const lpAccountSerializer: Serializer<LpAccount> = struct([
  ["liquidity", u64()],
  ["shares", u64()],
  ["lastAddLiquidityTimestamp", u64()],
  ["exchange", publicKey()],
  ["owner", publicKey()],
  ["delegate", publicKey()],
  ["bump", u8()],
  ["_padding", bytes({ size: 7 })],
]);
