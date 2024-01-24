import {
  Serializer,
  struct,
  bytes,
  publicKey,
  u8,
  u64,
} from "@metaplex-foundation/umi/serializers";
import { SettlementRequest } from "../settlementRequest";

export const settlementRequestSerializer: Serializer<SettlementRequest> = struct([
  ["id", u64()],
  ["maturity", u64()],
  ["amount", u64()],
  ["keeperTip", u64()],
  ["exchange", publicKey()],
  ["owner", publicKey()],
  ["ownerTokenAccount", publicKey()],
  ["bump", u8()],
  ["_padding", bytes({ size: 7 })],
]);
