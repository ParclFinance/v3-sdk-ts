import {
  Serializer,
  struct,
  bytes,
  publicKey,
  array,
  u8,
  u32,
  u64,
  u128,
  i128,
} from "@metaplex-foundation/umi/serializers";
import { MarginAccount, Position } from "../marginAccount";
import { PreciseIntToDecimalsSerializer } from "./preciseMath";

export const positionSerializer: Serializer<Position> = struct([
  ["size", i128()],
  ["lastInteractionPrice", u128()],
  ["lastInteractionFundingPerUnit", PreciseIntToDecimalsSerializer],
  ["marketId", u32()],
  ["_padding", bytes({ size: 4 })],
]);

export const marginAccountSerializer: Serializer<MarginAccount> = struct([
  ["positions", array(positionSerializer, { size: 12 })],
  ["margin", u64()],
  ["maxLiquidationFee", u64()],
  ["id", u32()],
  ["exchange", publicKey()],
  ["owner", publicKey()],
  ["delegate", publicKey()],
  ["inLiquidation", u8()],
  ["bump", u8()],
  ["_padding", bytes({ size: 10 })],
]);
