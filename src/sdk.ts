import { Commitment, ConfirmOptions } from "@solana/web3.js";
import { ParclV3AccountFetcher } from "./accountFetcher";
import { ParclV3InstructionBuilder } from "./instructionBuilder";
import { ParclV3TransactionBuilder } from "./transactionBuilder";

export type ParclV3SdkConfig = {
  rpcUrl: string;
  commitment?: Commitment;
  confirmOptions?: ConfirmOptions;
};

export class ParclV3Sdk {
  public accountFetcher: ParclV3AccountFetcher;
  public ix: ParclV3InstructionBuilder;

  constructor(config: ParclV3SdkConfig) {
    this.accountFetcher = new ParclV3AccountFetcher({
      rpcUrl: config.rpcUrl,
      commitment: config.commitment,
    });
    this.ix = new ParclV3InstructionBuilder();
  }

  transactionBuilder(): ParclV3TransactionBuilder {
    return new ParclV3TransactionBuilder(this.ix);
  }
}
