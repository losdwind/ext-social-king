import type { PlasmoMessaging } from "@plasmohq/messaging"
// import getAccount from "./requestAccount";

import { createWalletClient, custom } from "viem"
import { sepolia } from "viem/chains"
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: async () => {
      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });
      const [account] = await walletClient.requestAddresses();
      return account; // Make sure this return is captured
    }
  }).then(injectedResults => {
    for (const frameResult of injectedResults) {
      const { frameId, result } = frameResult;
      console.log(`Frame ${frameId} result:`, result);
      res.send({ result });
    }
  });
}

export default handler