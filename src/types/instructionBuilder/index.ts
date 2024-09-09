import { Address } from "../address";
import { U64 } from "../number";
export * from "./serializers";

export type CreateMarginAccountAccounts = {
  exchange: Address;
  marginAccount: Address;
  owner: Address;
};

export type CreateMarginAccountParams = {
  marginAccountId: number;
};

export type CloseMarginAccountAccounts = {
  exchange: Address;
  marginAccount: Address;
  owner: Address;
};

export type DepositMarginAccounts = {
  exchange: Address;
  marginAccount: Address;
  collateralVault: Address;
  signerTokenAccount: Address;
  signer: Address;
};

export type DepositMarginParams = {
  margin: U64;
};

export type WithdrawMarginAccounts = {
  exchange: Address;
  marginAccount: Address;
  settlementRequest: Address;
  ownerTokenAccount: Address;
  owner: Address;
};

export type WithdrawMarginParams = {
  margin: U64;
  settlementRequestId: U64;
  keeperTip: U64;
};

export type ModifyPositionAccounts = {
  exchange: Address;
  marginAccount: Address;
  signer: Address;
};

export type ModifyPositionParams = {
  marketId: number;
  sizeDelta: U64;
  acceptablePrice: U64;
};

export type SetMarginAccountDelegateAccounts = {
  exchange: Address;
  marginAccount: Address;
  owner: Address;
};

export type SetMarginAccountDelegateParams = {
  delegate: Address;
};

export type LiquidateAccounts = {
  exchange: Address;
  marginAccount: Address;
  liquidatorMarginAccount: Address;
  liquidator: Address;
  owner: Address;
};

export type LiquidateParams = {
  isFullLiquidation: boolean;
};

export type UpgradeLpAccountAccounts = {
  exchange: Address;
  lpAccount: Address;
  lpPosition: Address;
  owner: Address;
};

export type UpgradeLpAccountParams = {
  lpPositionId: U64;
};

export type CloseLpAccountAccounts = {
  exchange: Address;
  lpAccount: Address;
  owner: Address;
};

export type AddLiquidityV2Accounts = {
  exchange: Address;
  lpPosition: Address;
  collateralVault: Address;
  ownerTokenAccount: Address;
  owner: Address;
};

export type AddLiquidityV2Params = {
  liquidity: U64;
  lpPositionId: U64;
};

export type RemoveLiquidityV2Accounts = {
  exchange: Address;
  lpPosition: Address;
  settlementRequest: Address;
  ownerTokenAccount: Address;
  owner: Address;
};

export type RemoveLiquidityV2Params = {
  settlementRequestId: U64;
  shares: U64;
  keeperTip: U64;
};

export type CloseLpPositionAccounts = {
  exchange: Address;
  lpPosition: Address;
  owner: Address;
};

export type ProcessSettlementRequestsAccounts = {
  exchange: Address;
  collateralVault: Address;
  keeperTokenAccount: Address;
  payer: Address;
};

export type RefreshLockedOiAccountingAccounts = {
  exchange: Address;
  payer: Address;
};
