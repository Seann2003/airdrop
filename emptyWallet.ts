import {
  PublicKey,
  Keypair,
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(wallet));
const to = new PublicKey("J2327EQrj4fiGu3A1Fm93KMR6DKWVdccqPz2P5aZxPKo");

// Create a solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    // Get balance of dev wallet
    const balance = await connection.getBalance(from.publicKey);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance,
      })
    );

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;

    transaction.feePayer = from.publicKey;

    // Calculate the exact fee rate to transfer entire SOL amount out of account minus fees
    const fee =
      (
        await connection.getFeeForMessage(
          transaction.compileMessage(),
          "confirmed"
        )
      ).value || 0;

    // Remove our transfer instruction to replace it
    transaction.instructions.pop();

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - fee,
      })
    );

    // Sign transaction, broadcast and confirm
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);

    console.log(`Success! Check out your TX here:
        https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops something went wrong: ${e}`);
  }
})();
