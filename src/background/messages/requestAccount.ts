import { createWalletClient, custom } from "viem"
import { sepolia } from "viem/chains"

export default async function getAccount() {
  console.log("request Account from window.ethereum");
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });
  console.log(walletClient);
  const [account] = await walletClient.requestAddresses();
  setTimeout(() => {
    
  }, 5000);
  return account;
}