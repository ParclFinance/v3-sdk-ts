import { Address } from "../address";

export type ProgramAccount<T> = {
  account: T;
  address: Address;
};
