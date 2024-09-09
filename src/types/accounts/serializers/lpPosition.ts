import {
  Serializer,
  struct,
  bytes,
  publicKey,
  u8,
  u64,
} from "@metaplex-foundation/umi/serializers";
import { LpPosition } from "../lpPosition";

export const lpPositionSerializer: Serializer<LpPosition> = struct([
  ["id", u64()],
  ["liquidity", u64()],
  ["shares", u64()],
  ["maturity", u64()],
  ["exchange", publicKey()],
  ["owner", publicKey()],
  ["bump", u8()],
  ["_padding", bytes({ size: 7 })],
]);
