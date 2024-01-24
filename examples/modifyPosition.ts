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
  const marketId = 4;
  const [marketAddress] = getMarketPda(exchangeAddress, marketId);
  const market = await sdk.accountFetcher.getMarket(marketAddress);
  if (market === undefined) {
    throw new Error("Failed to fetch market");
  }
  const priceFeed = await sdk.accountFetcher.getPythPriceFeed(market.priceFeed);
  if (priceFeed === undefined) {
    throw new Error("Failed to fetch priceFeed");
  }
  // trade 0.1 sqft long -- -0.1 sqft would be short or decreasing previous long position
  const sizeDelta = parseSize(0.1);
  // Naively accepting up to 10% price impact for this long trade
  // NOTE: pyth sdk gives priceFeed.aggregate.price formatted. So it's 100 not 100e8)
  const acceptablePrice = parsePrice(1.1 * priceFeed.aggregate.price);
  const markets = [marketAddress];
  const priceFeeds = [market.priceFeed];
  const connection = new Connection(rpcUrl);
  const { blockhash: latestBlockhash } = await connection.getLatestBlockhash();
  // build tx
  const tx = sdk
    .transactionBuilder()
    // create new margin account since we dont have one yet
    .createMarginAccount(
      { exchange: exchangeAddress, marginAccount, owner: signer.publicKey },
      { marginAccountId }
    )
    // deposit margin collateral into new margin account
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
    // modify a new position (long trade)
    .modifyPosition(
      { exchange: exchangeAddress, marginAccount, signer: signer.publicKey },
      { sizeDelta, marketId, acceptablePrice },
      markets,
      priceFeeds
    )
    .feePayer(signer.publicKey)
    .buildSigned([signer], latestBlockhash);
  console.log((await connection.simulateTransaction(tx)).value);
  // send tx
  // sendAndConfirmTransaction(connection, tx, [owner]);
})();
