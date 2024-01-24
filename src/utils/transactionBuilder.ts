import { AccountMeta } from "@solana/web3.js";
import { WritableMarkets } from "../types";
import { translateAddress } from ".";
import { Address } from "../types";

export function getMarginAccountRemainingAccounts(
  markets: Address[],
  priceFeeds: Address[],
  writableMarkets: WritableMarkets,
  writableMarketAddress?: Address
): AccountMeta[] {
  if (writableMarkets === "some" && writableMarketAddress === undefined) {
    throw new Error("No writableMarketAddress provided but writableMarkets is set to 'some'");
  }
  return [
    ...markets.map((marketAddress) => ({
      pubkey: translateAddress(marketAddress),
      isSigner: false,
      isWritable:
        writableMarkets === "all" ||
        (writableMarkets === "some" &&
          translateAddress(writableMarketAddress as Address).equals(
            translateAddress(marketAddress)
          ))
          ? true
          : false,
    })),
    ...priceFeeds.map((priceFeedAddress) => ({
      pubkey: translateAddress(priceFeedAddress),
      isSigner: false,
      isWritable: false,
    })),
  ];
}

export function getProcessSettlementRequestsRemainingAccounts(
  settlementRequests: Address[],
  ownerTokenAccounts: Address[],
  owners: Address[]
): AccountMeta[] {
  return [
    ...settlementRequests.map((settlementRequestAddress) => ({
      pubkey: translateAddress(settlementRequestAddress),
      isSigner: false,
      isWritable: true,
    })),
    ...ownerTokenAccounts.map((ownerTokenAccountsAddress) => ({
      pubkey: translateAddress(ownerTokenAccountsAddress),
      isSigner: false,
      isWritable: true,
    })),
    ...owners.map((ownersAddress) => ({
      pubkey: translateAddress(ownersAddress),
      isSigner: false,
      isWritable: true,
    })),
  ];
}
