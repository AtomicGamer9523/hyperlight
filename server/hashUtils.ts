import { crypto } from "https://deno.land/std@0.192.0/crypto/crypto.ts";
import { toHashString } from "https://deno.land/std@0.192.0/crypto/to_hash_string.ts";

interface dataHashes {
    [fileNameHash: string]: string
}

let dataHashes: dataHashes = {};

async function hash(input: string) {
    const text = new TextEncoder().encode(input);
    const res = await crypto.subtle.digest("BLAKE3", text);
    return toHashString(res, "base64");
}

export async function compareHashes(key: string, newData: string, ifChanged: () => Promise<void>) {
    const newDataHash = await hash(newData);
    if (dataHashes[key] != newDataHash) {
        console.log(`Key ${key} updated!`);
        console.trace(`Hash: ${newDataHash}`);
        dataHashes[key] = newDataHash;
        await ifChanged();
    }
}

Deno.addSignalListener("SIGINT", async () => {
    console.debug("SIGINT recieved!");
    await Deno.writeTextFile("./.patch", JSON.stringify(dataHashes));
    Deno.exit();
});

try {
    const maybeBackup = await Deno.readTextFile("./people.json");
    const data = JSON.parse(maybeBackup);
    dataHashes = data
} catch (_) {}
