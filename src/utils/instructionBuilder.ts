import { Serializer } from "@metaplex-foundation/umi/serializers";
import { sha256 } from "@noble/hashes/sha256";
import { Buffer } from "buffer";

export const SIGHASH_GLOBAL_NAMESPACE = "global";

export function encodeInstructionData<T>(
  ixName: string,
  ixData?: T,
  serializer?: Serializer<T>
): Buffer {
  const discriminator = sighash(SIGHASH_GLOBAL_NAMESPACE, ixName);
  if (ixData === undefined || serializer === undefined) {
    return discriminator;
  } else {
    const serializedIxData = Buffer.from(serializer.serialize(ixData));
    return Buffer.concat([discriminator, serializedIxData]);
  }
}

function sighash(nameSpace: string, ixName: string): Buffer {
  const preimage = `${nameSpace}:${ixName}`;
  return Buffer.from(sha256(preimage).slice(0, 8));
}
