import { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi-public-keys";
import { PublicKey } from "@solana/web3.js";

export type Address = string | UmiPublicKey | PublicKey;
