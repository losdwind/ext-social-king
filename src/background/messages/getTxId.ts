
import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("call getTxId successfully")
  const network = process.env.NEXT_PUBLIC_NETWORK || "devnet"
  console.log(req.body)

  const fetchTx = async (tags:{
    name: string;
    value: any;
}[]) => {
    const query = `
      query getTags{
        transactions(tags: ${JSON.stringify(tags).replace(/"([^(")"]+[^\\"]+)":/g, "$1:")}, order: ASC, limit: 1) {
          edges {
            node {
              id
              address
            }
          }
        }
      }
    `
    console.log("queyr", query)
    const response = await fetch(
      `https://arweave.${network}.irys.xyz/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      }
    )
    const result = await response.json()
    return result.data
  }
  const tags = [
    { name: "App-Name", value: "Bodhi" },
    { name: "app-name", value: "SocialKing" },
    { name: "author-platform", value: "twitter" },
    { name: "author-username", value: req.body.tweet.username },
    { name: "timestamp", value: req.body.tweet.timestamp },
  ]
  try {
    const tx = await fetchTx(tags)
    console.log("query results", tx)
    res.send({
      txId: tx.id
    })
  } catch(error){
    res.send({
      txId: null
    })
  }


}

export default handler
