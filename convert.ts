import bs58 from "bs58";
import prompt from "prompt-sync";

function walletToBase58() {
  let decoded = prompt()("Enter the decoded secret key: ");
  return bs58.encode(new Uint8Array(JSON.parse(decoded)));
}

function base58ToWallet() {
  let secretKey = prompt()("Enter the base58 encoded secret key: ");
  return JSON.stringify(Array.from(bs58.decode(secretKey)));
}

const option = prompt()(
  "Enter 1 to convert wallet to base58, 2 to convert base58 to wallet :"
);

if (option === "1") {
  console.log("Encoded in base58:", walletToBase58());
} else if (option === "2") {
  console.log("Decoded from base58:", base58ToWallet());
} else {
  console.log("Invalid option");
}
