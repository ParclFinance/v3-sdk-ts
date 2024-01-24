import { PublicKey } from "@solana/web3.js";
import { Address } from "../types";

export function translateAddress(address: Address): PublicKey {
  return address instanceof PublicKey ? address : new PublicKey(address);
}
