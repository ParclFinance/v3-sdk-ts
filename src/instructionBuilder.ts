import {
  AccountMeta,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { PARCL_V3_PROGRAM_ID, PARCL_V3_EVENT_AUTHORITY, TOKEN_PROGRAM_ID } from "./constants";
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
  CreateLpAccountAccounts,
  CloseLpAccountAccounts,
  AddLiquidityAccounts,
  AddLiquidityParams,
  RemoveLiquidityAccounts,
  RemoveLiquidityParams,
  SetLpAccountDelegateAccounts,
  SetLpAccountDelegateParams,
  ProcessSettlementRequestsAccounts,
  RefreshLockedOiAccountingAccounts,
  addLiquidityParamsSerializer,
  removeLiquidityParamsSerializer,
  setLpAccountDelegateParamsSerializer,
  setMarginAccountDelegateParamsSerializer,
  createMarginAccountParamsSerializer,
  depositMarginParamsSerializer,
  withdrawMarginParamsSerializer,
  modifyPositionParamsSerializer,
  liquidateParamsSerializer,
} from "./types";
import { translateAddress, encodeInstructionData } from "./utils";

export class ParclV3InstructionBuilder {
  // LP ACCOUNT //

  createLpAccount(accounts: CreateLpAccountAccounts): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: false },
        { pubkey: translateAddress(accounts.lpAccount), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.owner), isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
      ],
      data: encodeInstructionData("create_lp_account"),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  closeLpAccount(accounts: CloseLpAccountAccounts): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: false },
        { pubkey: translateAddress(accounts.lpAccount), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.owner), isSigner: true, isWritable: true },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
      ],
      data: encodeInstructionData("close_lp_account"),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  addLiquidity(accounts: AddLiquidityAccounts, params: AddLiquidityParams): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.lpAccount), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.collateralVault), isSigner: false, isWritable: true },
        {
          pubkey: translateAddress(accounts.signerTokenAccount),
          isSigner: false,
          isWritable: true,
        },
        { pubkey: translateAddress(accounts.signer), isSigner: true, isWritable: true },
        { pubkey: translateAddress(TOKEN_PROGRAM_ID), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
      ],
      data: encodeInstructionData("add_liquidity", params, addLiquidityParamsSerializer),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  removeLiquidity(
    accounts: RemoveLiquidityAccounts,
    params: RemoveLiquidityParams
  ): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.lpAccount), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.settlementRequest), isSigner: false, isWritable: true },
        {
          pubkey: translateAddress(accounts.ownerTokenAccount),
          isSigner: false,
          isWritable: false,
        },
        { pubkey: translateAddress(accounts.owner), isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
      ],
      data: encodeInstructionData("remove_liquidity", params, removeLiquidityParamsSerializer),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  setLpAccountDelegate(
    accounts: SetLpAccountDelegateAccounts,
    params: SetLpAccountDelegateParams
  ): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: false },
        { pubkey: translateAddress(accounts.lpAccount), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.owner), isSigner: true, isWritable: true },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
      ],
      data: encodeInstructionData(
        "set_lp_account_delegate",
        params,
        setLpAccountDelegateParamsSerializer
      ),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  // MARGIN ACCOUNT //

  createMarginAccount(
    accounts: CreateMarginAccountAccounts,
    params: CreateMarginAccountParams
  ): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: false },
        { pubkey: translateAddress(accounts.marginAccount), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.owner), isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
      ],
      data: encodeInstructionData(
        "create_margin_account",
        params,
        createMarginAccountParamsSerializer
      ),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  closeMarginAccount(accounts: CloseMarginAccountAccounts): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: false },
        { pubkey: translateAddress(accounts.marginAccount), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.owner), isSigner: true, isWritable: true },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
      ],
      data: encodeInstructionData("close_margin_account"),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  depositMargin(
    accounts: DepositMarginAccounts,
    params: DepositMarginParams
  ): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.marginAccount), isSigner: false, isWritable: true },
        {
          pubkey: translateAddress(accounts.collateralVault),
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: translateAddress(accounts.signerTokenAccount),
          isSigner: false,
          isWritable: true,
        },
        { pubkey: translateAddress(accounts.signer), isSigner: true, isWritable: true },
        { pubkey: translateAddress(TOKEN_PROGRAM_ID), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
      ],
      data: encodeInstructionData("deposit_margin", params, depositMarginParamsSerializer),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  withdrawMargin(
    accounts: WithdrawMarginAccounts,
    params: WithdrawMarginParams,
    remainingAccounts: AccountMeta[]
  ): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.marginAccount), isSigner: false, isWritable: true },
        {
          pubkey: translateAddress(accounts.settlementRequest),
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: translateAddress(accounts.ownerTokenAccount),
          isSigner: false,
          isWritable: false,
        },
        { pubkey: translateAddress(accounts.owner), isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
        ...remainingAccounts,
      ],
      data: encodeInstructionData("withdraw_margin", params, withdrawMarginParamsSerializer),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  modifyPosition(
    accounts: ModifyPositionAccounts,
    params: ModifyPositionParams,
    remainingAccounts: AccountMeta[]
  ): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.marginAccount), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.signer), isSigner: true, isWritable: true },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
        ...remainingAccounts,
      ],
      data: encodeInstructionData("modify_position", params, modifyPositionParamsSerializer),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  setMarginAccountDelegate(
    accounts: SetMarginAccountDelegateAccounts,
    params: SetMarginAccountDelegateParams
  ): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: false },
        { pubkey: translateAddress(accounts.marginAccount), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.owner), isSigner: true, isWritable: true },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
      ],
      data: encodeInstructionData(
        "set_margin_account_delegate",
        params,
        setMarginAccountDelegateParamsSerializer
      ),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  liquidate(
    accounts: LiquidateAccounts,
    remainingAccounts: AccountMeta[],
    params?: LiquidateParams
  ): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.marginAccount), isSigner: false, isWritable: true },
        {
          pubkey: translateAddress(accounts.liquidatorMarginAccount),
          isSigner: false,
          isWritable: true,
        },
        { pubkey: translateAddress(accounts.liquidator), isSigner: true, isWritable: true },
        { pubkey: translateAddress(accounts.owner), isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
        ...remainingAccounts,
      ],
      data: encodeInstructionData(
        "liquidate",
        params === undefined ? null : params,
        liquidateParamsSerializer
      ),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  // SETTLEMENT //

  processSettlementRequests(
    accounts: ProcessSettlementRequestsAccounts,
    remainingAccounts: AccountMeta[]
  ): TransactionInstruction {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.collateralVault), isSigner: false, isWritable: true },
        {
          pubkey: translateAddress(accounts.keeperTokenAccount),
          isSigner: false,
          isWritable: true,
        },
        { pubkey: translateAddress(accounts.payer), isSigner: true, isWritable: true },
        { pubkey: translateAddress(TOKEN_PROGRAM_ID), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
        ...remainingAccounts,
      ],
      data: encodeInstructionData("process_settlement_requests"),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }

  // EXCHANGE //

  refreshLockedOiAccounting(
    accounts: RefreshLockedOiAccountingAccounts,
    remainingAccounts: AccountMeta[]
  ) {
    return new TransactionInstruction({
      keys: [
        { pubkey: translateAddress(accounts.exchange), isSigner: false, isWritable: true },
        { pubkey: translateAddress(accounts.payer), isSigner: true, isWritable: true },
        { pubkey: translateAddress(PARCL_V3_EVENT_AUTHORITY), isSigner: false, isWritable: false },
        { pubkey: translateAddress(PARCL_V3_PROGRAM_ID), isSigner: false, isWritable: false },
        ...remainingAccounts,
      ],
      data: encodeInstructionData("refresh_locked_oi_accounting"),
      programId: translateAddress(PARCL_V3_PROGRAM_ID),
    });
  }
}
