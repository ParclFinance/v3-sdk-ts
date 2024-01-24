import { clusterApiUrl } from "@solana/web3.js";
import { ParclV3Sdk } from "../src";

(async function main() {
  const sdk = new ParclV3Sdk({ rpcUrl: clusterApiUrl("mainnet-beta") });
  console.log(await sdk.accountFetcher.getExchange("82dGS7Jt4Km8ZgwZVRsJ2V6vPXEhVdgDaMP7cqPGG1TW"));
  console.log(await sdk.accountFetcher.getMarket("7UHPEqFRVgyYtjXuXdL3hxwP8NMBQoeSxBSy23xoKrnG"));
  // need premium url
  // console.log(await sdk.accountFetcher.getAllMarginAccounts());
})();
