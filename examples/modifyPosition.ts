import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import bs58 from "bs58";
import {
  ParclV3Sdk,
  getMarginAccountPda,
  getMarketPda,
  translateAddress,
  parseCollateralAmount,
  parsePrice,
  parseSize,
  getExchangePda,
} from "../src";
import Decimal from "decimal.js";
import * as dotenv from "dotenv";
dotenv.config();

(async function main() {
  const signer = Keypair.fromSecretKey(bs58.decode(process.env.KEYPAIR as string));
  const rpcUrl = clusterApiUrl("mainnet-beta");
  const sdk = new ParclV3Sdk({ rpcUrl });
  // only live exchange is exchangeId=0
  const [exchangeAddress] = getExchangePda(0);
  const exchange = await sdk.accountFetcher.getExchange(exchangeAddress);
  if (exchange === undefined) {
    throw new Error("Failed to fetch exchange");
  }
  const marginAccountId = 2;
  const [marginAccount] = getMarginAccountPda(exchangeAddress, signer.publicKey, marginAccountId);
  const signerTokenAccount = getAssociatedTokenAddressSync(
    translateAddress(exchange.collateralMint),
    signer.publicKey
  );
  // deposit $5.1 of margin collateral
  // NOTE: flip collateral expo sign
  const margin = parseCollateralAmount(5.1, -exchange.collateralExpo);
  // trading market with id 4
  const marketIdToTrade = 4;
  const marketIds: number[] = [];
  // if you already have margin account:
  // const marketIds = (await sdk.accountFetcher.getMarginAccount(marginAccount))?.positions.map(position => position.marketId).filter(marketId => marketId > 0) as number[];
  // dont forget to add a new market id to the array if you're trading a new market
  if (!marketIds.includes(marketIdToTrade)) {
    marketIds.push(marketIdToTrade);
  }
  const marketAddresses = marketIds.map((marketId) => getMarketPda(exchangeAddress, marketId)[0]);
  const marketAccounts = (await sdk.accountFetcher.getMarkets(marketAddresses)).filter(
    (market) => market != undefined
  );
  if (marketAccounts.length !== marketAddresses.length) {
    throw new Error("Failed to fetch all provided markets");
  }
  const priceFeedAddresses = marketAccounts.map((market) => market!.account.priceFeed);
  const priceFeedAccounts = (await sdk.accountFetcher.getPythPriceFeeds(priceFeedAddresses)).filter(
    (market) => market != undefined
  );
  if (priceFeedAccounts.length !== priceFeedAddresses.length) {
    throw new Error("Failed to fetch all provided price feeds");
  }
  // trade 0.1 sqft long -- -0.1 sqft would be short or decreasing previous long position
  const sizeDelta = parseSize(0.1);
  // trading market with id 4, so using price feed at index 0 corresponding to mkt with id 4.
  // make sure you select the correct price feed for acceptable price calc
  const priceFeed = priceFeedAccounts[0]!;
  const isPythV2 = "priceMessage" in priceFeed;
  const indexPrice = isPythV2
    ? new Decimal(priceFeed.priceMessage.price.toString())
        .div(10 ** -priceFeed.priceMessage.exponent)
        .toNumber()
    : priceFeed.aggregate.price; // formatted already
  // Naively accepting up to 10% price impact for this long trade
  const acceptablePrice = parsePrice(1.1 * indexPrice);
  const markets = marketAddresses;
  const priceFeeds = priceFeedAddresses;
  const connection = new Connection(rpcUrl);
  const { blockhash: latestBlockhash } = await connection.getLatestBlockhash();
  // build tx
  const tx = sdk
    .transactionBuilder()
    // create new margin account since we dont have one yet
    // remove this ix if you already have an account
    .createMarginAccount(
      { exchange: exchangeAddress, marginAccount, owner: signer.publicKey },
      { marginAccountId }
    )
    // deposit margin collateral into new margin account
    // remove this ix if you already have a funded account
    .depositMargin(
      {
        exchange: exchangeAddress,
        marginAccount,
        collateralVault: exchange.collateralVault,
        signer: signer.publicKey,
        signerTokenAccount,
      },
      { margin }
    )
    // trade (long)
    .modifyPosition(
      { exchange: exchangeAddress, marginAccount, signer: signer.publicKey },
      { sizeDelta, marketId: marketIdToTrade, acceptablePrice },
      markets,
      priceFeeds
    )
    .feePayer(signer.publicKey)
    .buildSigned([signer], latestBlockhash);
  console.log((await connection.simulateTransaction(tx)).value);
  // send tx
  // await sendAndConfirmTransaction(connection, tx, [signer]);
})();
