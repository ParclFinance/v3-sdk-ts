import {
  Serializer,
  struct,
  publicKey,
  u64,
  u32,
  bool,
  i128,
  option,
} from "@metaplex-foundation/umi/serializers";
import { OptionOrNullable } from "@metaplex-foundation/umi";
import {
  CreateMarginAccountParams,
  DepositMarginParams,
  WithdrawMarginParams,
  ModifyPositionParams,
  SetMarginAccountDelegateParams,
  LiquidateParams,
  AddLiquidityV2Params,
  RemoveLiquidityV2Params,
  UpgradeLpAccountParams,
} from "./index";

export const createMarginAccountParamsSerializer: Serializer<CreateMarginAccountParams> = struct([
  ["marginAccountId", u32()],
]);

export const depositMarginParamsSerializer: Serializer<DepositMarginParams> = struct([
  ["margin", u64()],
]);

export const withdrawMarginParamsSerializer: Serializer<WithdrawMarginParams> = struct([
  ["settlementRequestId", u64()],
  ["margin", u64()],
  ["keeperTip", u64()],
]);

export const modifyPositionParamsSerializer: Serializer<ModifyPositionParams> = struct([
  ["marketId", u32()],
  ["sizeDelta", i128()],
  ["acceptablePrice", u64()],
]);

export const setMarginAccountDelegateParamsSerializer: Serializer<SetMarginAccountDelegateParams> =
  struct([["delegate", publicKey()]]);

export const liquidateParamsSerializer: Serializer<OptionOrNullable<LiquidateParams>> = option(
  struct([["isFullLiquidation", bool()]])
);

export const addLiquidityV2ParamsSerializer: Serializer<AddLiquidityV2Params> = struct([
  ["liquidity", u64()],
  ["lpPositionId", u64()],
]);

export const removeLiquidityV2ParamsSerializer: Serializer<RemoveLiquidityV2Params> = struct([
  ["settlementRequestId", u64()],
  ["shares", u64()],
  ["keeperTip", u64()],
]);

export const upgradeLpAccountParamsSerializer: Serializer<UpgradeLpAccountParams> = struct([
  ["lpPositionId", u64()],
]);
