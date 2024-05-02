import { walletClient } from "../../lib/viem"

export {}

chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    console.log(request)
    if (request.action === "WALLET_INFO") {
      if (typeof window.ethereum !== "undefined") {
        // Your walletClient logic here
        const [account] = await walletClient.requestAddresses() // Assuming walletClient is defined and uses window.ethereum
        sendResponse({ account: account })
      } else {
        sendResponse({ error: "Ethereum object not found" })
      }
      return true // Important to return true when sendResponse will be called asynchronously
    }
  }
)
