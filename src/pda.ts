import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Buffer } from "buffer";
import { Address, U64 } from "./types";
import { PARCL_V3_PROGRAM_ID } from "./constants";
import { translateAddress } from "./utils";

export const EXCHANGE_PREFIX = "exchange";
export const COLLATERAL_VAULT_PREFIX = "collateral_vault";
export const LP_ACCOUNT_PREFIX = "lp_account";
export const LP_POSITION_PREFIX = "lp_position";
export const MARGIN_ACCOUNT_PREFIX = "margin_account";
export const MARKET_PREFIX = "market";
export const SETTLEMENT_REQUEST_PREFIX = "settlement_request";

const U64_MAX = new BN(2).pow(new BN(64)).sub(new BN(1));
const U32_MAX = new BN(2).pow(new BN(32)).sub(new BN(1));

export function getExchangePda(_id: U64): [PublicKey, number] {
  const id = new BN(_id.toString());
  if (id.ltn(0) || id.gt(U64_MAX)) {
    throw new Error("Exchange id must be 64-bit unsigned int");
  }
  return PublicKey.findProgramAddressSync(
    [Buffer.from(EXCHANGE_PREFIX), id.toArrayLike(Buffer, "le", 8)],
    new PublicKey(PARCL_V3_PROGRAM_ID)
  );
}

export function getCollateralVaultPda(
  exchange: Address,
  collateralMint: Address
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(COLLATERAL_VAULT_PREFIX),
      translateAddress(exchange).toBytes(),
      translateAddress(collateralMint).toBytes(),
    ],
    new PublicKey(PARCL_V3_PROGRAM_ID)
  );
}

export function getMarketPda(exchange: Address, id: number): [PublicKey, number] {
  const _id = new BN(id);
  if (_id.ltn(0) || _id.gt(U32_MAX)) {
    throw new Error("Market id must be 32-bit unsigned int");
  }
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(MARKET_PREFIX),
      translateAddress(exchange).toBytes(),
      _id.toArrayLike(Buffer, "le", 4),
    ],
    new PublicKey(PARCL_V3_PROGRAM_ID)
  );
}

export function getLpAccountPda(exchange: Address, owner: Address): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(LP_ACCOUNT_PREFIX),
      translateAddress(exchange).toBytes(),
      translateAddress(owner).toBytes(),
    ],
    new PublicKey(PARCL_V3_PROGRAM_ID)
  );
}

export function getLpPositionPda(
  exchange: Address,
  owner: Address,
  _id: number
): [PublicKey, number] {
  const id = new BN(_id.toString());
  if (id.ltn(0) || id.gt(U64_MAX)) {
    throw new Error("Lp position id must be 64-bit unsigned int");
  }
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(LP_POSITION_PREFIX),
      translateAddress(exchange).toBytes(),
      translateAddress(owner).toBytes(),
      id.toArrayLike(Buffer, "le", 8),
    ],
    new PublicKey(PARCL_V3_PROGRAM_ID)
  );
}

export function getMarginAccountPda(
  exchange: Address,
  owner: Address,
  id: number
): [PublicKey, number] {
  const _id = new BN(id);
  if (_id.ltn(0) || _id.gt(U32_MAX)) {
    throw new Error("Margin account id must be 32-bit unsigned int");
  }
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(MARGIN_ACCOUNT_PREFIX),
      translateAddress(exchange).toBytes(),
      translateAddress(owner).toBytes(),
      _id.toArrayLike(Buffer, "le", 4),
    ],
    new PublicKey(PARCL_V3_PROGRAM_ID)
  );
}

export function getSettlementRequestPda(owner: Address, _id: U64): [PublicKey, number] {
  const id = new BN(_id.toString());
  if (id.ltn(0) || id.gt(U64_MAX)) {
    throw new Error("Settlement request id must be 64-bit unsigned int");
  }
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SETTLEMENT_REQUEST_PREFIX),
      translateAddress(owner).toBytes(),
      id.toArrayLike(Buffer, "le", 8),
    ],
    new PublicKey(PARCL_V3_PROGRAM_ID)
  );
}

export function getEventAuthorityPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("_Event_authority")],
    new PublicKey(PARCL_V3_PROGRAM_ID)
  );
}
