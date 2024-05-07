chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "FETCH_DATA") {
    const query = `
          query {
            creates(first: 5) {
              id
              assetId
              sender
              arTxId
            }
          }`

    fetch(
      "https://api.studio.thegraph.com/query/72269/bodhi_wtf/version/latest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ query })
      }
    )
      .then((response) => response.json())
      .then((data) => sendResponse({ data }))
      .catch((error) => sendResponse({ error: error.message }))

    return true // Keep the messaging channel open for the response
  }
})
