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

export type CreateLpAccountAccounts = {
  exchange: Address;
  lpAccount: Address;
  owner: Address;
};

export type CloseLpAccountAccounts = {
  exchange: Address;
  lpAccount: Address;
  owner: Address;
};

export type AddLiquidityAccounts = {
  exchange: Address;
  lpAccount: Address;
  collateralVault: Address;
  signerTokenAccount: Address;
  signer: Address;
};

export type AddLiquidityParams = {
  liquidity: U64;
};

export type RemoveLiquidityAccounts = {
  exchange: Address;
  lpAccount: Address;
  settlementRequest: Address;
  ownerTokenAccount: Address;
  owner: Address;
};

export type RemoveLiquidityParams = {
  shares: U64;
  settlementRequestId: U64;
  keeperTip: U64;
};

export type SetLpAccountDelegateAccounts = {
  exchange: Address;
  lpAccount: Address;
  owner: Address;
};

export type SetLpAccountDelegateParams = {
  delegate: Address;
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
