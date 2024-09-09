import { Signer, Transaction, TransactionInstruction } from "@solana/web3.js";
import { ParclV3InstructionBuilder } from "./instructionBuilder";
import {
  CreateMarginAccountAccounts,
  CreateMarginAccountParams,
  CloseMarginAccountAccounts,
  DepositMarginAccounts,
  DepositMarginParams,
  WithdrawMarginAccounts,
  WithdrawMarginParams,
  ModifyPositionAccounts,
  ModifyPositionParams,
  SetMarginAccountDelegateAccounts,
  SetMarginAccountDelegateParams,
  LiquidateAccounts,
  LiquidateParams,
  ProcessSettlementRequestsAccounts,
  CloseLpAccountAccounts,
  AddLiquidityV2Accounts,
  AddLiquidityV2Params,
  RemoveLiquidityV2Accounts,
  RemoveLiquidityV2Params,
  CloseLpPositionAccounts,
  UpgradeLpAccountAccounts,
  UpgradeLpAccountParams,
} from "./types";
import {
  translateAddress,
  getMarginAccountRemainingAccounts,
  getProcessSettlementRequestsRemainingAccounts,
} from "./utils";
import { Address } from "./types";
import { getMarketPda } from "./pda";

export class ParclV3TransactionBuilder {
  ix: ParclV3InstructionBuilder;
  _instructions: TransactionInstruction[] = [];
  _feePayer?: Address;

  constructor(ix: ParclV3InstructionBuilder) {
    this.ix = ix;
  }

  buildSigned(signers: Signer[], recentBlockhash: string): Transaction {
    const tx = new Transaction().add(...this._instructions);
    if (this._feePayer !== undefined) {
      tx.feePayer = translateAddress(this._feePayer);
    }
    tx.recentBlockhash = recentBlockhash;
    tx.partialSign(...signers);
    return tx;
  }

  buildUnsigned(): Transaction {
    const tx = new Transaction().add(...this._instructions);
    if (this._feePayer !== undefined) {
      tx.feePayer = translateAddress(this._feePayer);
    }
    return tx;
  }

  instruction(ix: TransactionInstruction): this {
    this._instructions.push(ix);
    return this;
  }

  instructions(ix: TransactionInstruction): this {
    this._instructions.push(ix);
    return this;
  }

  feePayer(feePayer: Address): this {
    this._feePayer = feePayer;
    return this;
  }

  // LP ACCOUNT //

  closeLpAccount(accounts: CloseLpAccountAccounts): this {
    const ix = this.ix.closeLpAccount(accounts);
    return this.instruction(ix);
  }

  upgradeLpAccount(accounts: UpgradeLpAccountAccounts, params: UpgradeLpAccountParams): this {
    const ix = this.ix.upgradeLpAccount(accounts, params);
    return this.instruction(ix);
  }

  // LP POSITION //

  addLiquidityV2(accounts: AddLiquidityV2Accounts, params: AddLiquidityV2Params): this {
    const ix = this.ix.addLiquidityV2(accounts, params);
    return this.instruction(ix);
  }

  removeLiquidityV2(accounts: RemoveLiquidityV2Accounts, params: RemoveLiquidityV2Params): this {
    const ix = this.ix.removeLiquidityV2(accounts, params);
    return this.instruction(ix);
  }

  closeLpPosition(accounts: CloseLpPositionAccounts): this {
    const ix = this.ix.closeLpPosition(accounts);
    return this.instruction(ix);
  }

  // MARGIN ACCOUNT //

  createMarginAccount(
    accounts: CreateMarginAccountAccounts,
    params: CreateMarginAccountParams
  ): this {
    const ix = this.ix.createMarginAccount(accounts, params);
    return this.instruction(ix);
  }

  closeMarginAccount(accounts: CloseMarginAccountAccounts): this {
    const ix = this.ix.closeMarginAccount(accounts);
    return this.instruction(ix);
  }

  depositMargin(accounts: DepositMarginAccounts, params: DepositMarginParams): this {
    const ix = this.ix.depositMargin(accounts, params);
    return this.instruction(ix);
  }

  withdrawMargin(
    accounts: WithdrawMarginAccounts,
    params: WithdrawMarginParams,
    markets: Address[],
    priceFeeds: Address[]
  ): this {
    const remainingAccounts = getMarginAccountRemainingAccounts(markets, priceFeeds, "none");
    const ix = this.ix.withdrawMargin(accounts, params, remainingAccounts);
    return this.instruction(ix);
  }

  modifyPosition(
    accounts: ModifyPositionAccounts,
    params: ModifyPositionParams,
    markets: Address[],
    priceFeeds: Address[]
  ): this {
    const [writableMarket] = getMarketPda(accounts.exchange, params.marketId);
    const remainingAccounts = getMarginAccountRemainingAccounts(
      markets,
      priceFeeds,
      "some",
      writableMarket
    );
    const ix = this.ix.modifyPosition(accounts, params, remainingAccounts);
    return this.instruction(ix);
  }

  setMarginAccountDelegate(
    accounts: SetMarginAccountDelegateAccounts,
    params: SetMarginAccountDelegateParams
  ): this {
    const ix = this.ix.setMarginAccountDelegate(accounts, params);
    return this.instruction(ix);
  }

  liquidate(
    accounts: LiquidateAccounts,
    markets: Address[],
    priceFeeds: Address[],
    params?: LiquidateParams
  ): this {
    const remainingAccounts = getMarginAccountRemainingAccounts(markets, priceFeeds, "all");
    const ix = this.ix.liquidate(accounts, remainingAccounts, params);
    return this.instruction(ix);
  }

  // SETTLEMENT //

  processSettlementRequests(
    accounts: ProcessSettlementRequestsAccounts,
    settlementRequests: Address[],
    ownerTokenAccounts: Address[],
    owners: Address[]
  ): this {
    const remainingAccounts = getProcessSettlementRequestsRemainingAccounts(
      settlementRequests,
      ownerTokenAccounts,
      owners
    );
    const ix = this.ix.processSettlementRequests(accounts, remainingAccounts);
    return this.instruction(ix);
  }
}
