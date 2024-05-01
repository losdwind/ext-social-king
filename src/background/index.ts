// background.ts
// background.ts
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'FETCH_DATA') {
      const query = `
        query {
          creates(first: 5) {
            id
            assetId
            sender
            arTxId
          }
        }`;

      fetch("https://api.studio.thegraph.com/query/72269/bodhi_wtf/version/latest", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query })
      })
      .then(response => response.json())
      .then(data => sendResponse({data}))
      .catch(error => sendResponse({error: error.message}));

      return true; // Keep the messaging channel open for the response
    }
  }
);


chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

  const TWITTER_ORIGIN = 'https://twitter.com';

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  if (url.origin === TWITTER_ORIGIN) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel.html',
      enabled: true
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  }
});

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