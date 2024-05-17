// background.ts

// const TWITTER_ORIGIN = "https://twitter.com"

// export {}
// export {}

// chrome.sidePanel
//   .setPanelBehavior({ openPanelOnActionClick: true })
//   .catch((error) => console.error(error))

// console.log(
//   "Live now; make now always the most precious time. Now will never come again."
// )
import "@plasmohq/messaging/background"

import { startHub } from "@plasmohq/messaging/pub-sub"

console.log(`BGSW - Starting Hub`)
startHub()
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
