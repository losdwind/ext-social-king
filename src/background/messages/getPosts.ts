import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
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
    .then((data) => {
      console.log("GraphQL response: ", data)
      res.send({
        posts: data
      })
    })
    .catch((error) => {
      res.send({
        posts: [],
        error: error.message
      })
    })
}

export default handler
