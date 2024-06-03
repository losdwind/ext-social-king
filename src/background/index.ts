import { createWalletClient, http } from "viem"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { polygonAmoy } from "viem/chains"

import { Storage } from "@plasmohq/storage"

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    console.log("Extension installed. Generating wallet...")
    const privateKey = generatePrivateKey()

    // const account = privateKeyToAccount(privateKey)

    const storage = new Storage()

    // await storage.setPassword("123456") // The only diff

    await storage.set("pk", privateKey)
    console.log("pk",await storage.get("pk"))
  }
})

// chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
//   if (!tab.url) return
//   const url = new URL(tab.url)
//   // Enables the side panel on google.com
//   if (url.origin === TWITTER_ORIGIN) {
//     await chrome.sidePanel.setOptions({
//       tabId,
//       path: "sidepanel.html",
//       enabled: true
//     })
//   } else {
//     // Disables the side panel on all other sites
//     await chrome.sidePanel.setOptions({
//       tabId,
//       enabled: false
//     })
//   }
// })

// // Context Menue
// function setupContextMenu() {
//   chrome.contextMenus.create({
//     id: 'sell',
//     title: 'Sell',
//     contexts: ['selection']
//   });
//   chrome.contextMenus.create({
//     id: 'buy',
//     title: 'buy',
//     contexts: ['selection']
//   });
// }

// chrome.runtime.onInstalled.addListener(() => {
//   setupContextMenu();
// });

// chrome.contextMenus.onClicked.addListener((data, tab) => {
//   // Store the last word in chrome.storage.session.
//   chrome.storage.session.set({ contentID: data.selectionText });

//   // Make sure the side panel is open.
//   chrome.sidePanel.open({ tabId: tab.id });
// });

// const client = createClient({
//   url: '/graphql', // This is a placeholder, actual requests are sent via background.ts
//   exchanges: [cacheExchange, fetchExchange],
//   fetchOptions: () => {
//     return {
//       fetch: (url: string, options: any) => {
//         return new Promise((resolve, reject) => {
//           chrome.runtime.sendMessage({ query: options.body }, response => {
//             if (response.error) {
//               reject(response.error);
//             } else {
//               resolve(new Response(JSON.stringify(response.data)));
//             }
//           });
//         });
//       }
//     };
//   }
// });
