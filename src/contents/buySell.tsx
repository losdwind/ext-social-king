import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import getTx from "@/lib/getTx"
import Query from "@irys/query"
// import Arweave from "arweave"
import cssText from "data-text:~style.css"
import { validate } from "graphql"
import {
  type PlasmoCSConfig,
  type PlasmoCSUIProps,
  type PlasmoGetInlineAnchorList,
  type PlasmoGetShadowHostId
} from "plasmo"
import { useEffect, useRef, useState, type FC } from "react"
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseEther,
  toHex,
  type Chain,
  type PrivateKeyAccount,
  type WriteContractParameters
} from "viem"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { optimism, sepolia } from "viem/chains"

import { sendToBackground, sendToBackgroundViaRelay } from "@plasmohq/messaging"
import { SecureStorage } from "@plasmohq/storage/secure"

import { bodhiAbi } from "~core/bodhiAbi"

// const arweave = Arweave.init({
//   // host: "arweave.net",
//   // port: 443,
//   // protocol: "https"
// })
export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)")
  return style
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const anchors = document.querySelectorAll('article[role="article"]')
  return Array.from(anchors).map((element) => {
    return { element, insertPosition: "afterend" }
  })
}

const storage = new SecureStorage()
var account: PrivateKeyAccount


const onRequestAccount = async () => {
  const storage = new SecureStorage()
  const savedAccount = await storage.get("account")
  console.log("saved Account", savedAccount)
  if (savedAccount) {
    return savedAccount
  }
  const privateKey = generatePrivateKey()
  account = privateKeyToAccount(privateKey)
  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http()
  })

  await storage.setPassword("123456") // The only diff

  await storage.set("pk", privateKey)
  await storage.set("account", account)
  console.log("init account", account)
  return account
}

const onRequestTxId = async (tweet: Tweet) => {
  const tags = [
    { name: "App-Name", value: "Bodhi" },
    { name: "app-name", value: "SocialKing" },
    { name: "author-platform", value: "twitter" },
    { name: "author-username", value: tweet.username },
    { name: "author-timestamp", value: tweet.timestamp },
    { name: "creator", value: account }
  ]
  const txId = await sendToBackground({
    name: "getTxId",
    body: {
      tags: tags
    }
  })
  console.log("txId", txId)

  return txId
  // return txId
}

const onRequestAssetId = async (txId: string) => {
  const assetId = await sendToBackground({
    name: "getAssetId",
    body: {
      txId: txId
    }
  })
  return assetId
}

const uploadAsset = async (tweet: Tweet) => {
  console.log("call uploadAsset")
  const tags = [
    { name: "App-Name", value: "Bodhi" },
    { name: "app-name", value: "SocialKing" },
    { name: "author-platform", value: "twitter" },
    { name: "author-username", value: tweet.username },
    { name: "author-timestamp", value: tweet.timestamp },
    { name: "creator", value: account }
  ]
  const irysTxId = await sendToBackground({
    name: "uploadAsset",
    body: {
      content:tweet.tweetURL,
      tags
    }
  })
  return irysTxId
}

const onBuyShare = async (asset: number, share: number, tweet: Tweet) => {
  console.log("onBuyShare")
  if (!account) {
    await onRequestAccount()
  }
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http()
  })

  console.log("globalAccount", account)
  const res = await onRequestTxId(tweet)
  console.log("res", res)
  if (!res.txId) {
    console.log("before call upload asset")
    const txId = await uploadAsset(tweet)
    console.log("upload asset", txId)

    const createResult = await walletClient.writeContract({
      address: toHex(process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS),
      abi: bodhiAbi,
      functionName: "create",
      args: [txId],
      account: globalAccount
    })
    console.log("create Result", createResult)
  }

  await onRequestAssetId(res.txId)

  await walletClient.writeContract({
    address: toHex(process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS),
    abi: bodhiAbi,
    functionName: "buy",
    args: [BigInt(asset), parseEther(share.toString())],
    account: globalAccount
  })

  console.log("Buying shares")
}

const onSellShare = async (asset: number, share: number) => {
  console.log("onSellShare")
  if (!account) {
    await onRequestAccount()
  }
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http()
  })

  await walletClient.writeContract({
    address: toHex(process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS),
    abi: bodhiAbi,
    functionName: "sell",
    args: [BigInt(asset), parseEther(share.toString())],
    account: globalAccount
  })
  console.log("Selling shares")
}

// txToAssetId

function extractTweetData(tweetElement): Tweet {
  // Extracting username (@ handle)
  const usernameElement = tweetElement.querySelector(
    'a[href*="/"] > div > span'
  )
  const username = usernameElement ? usernameElement.textContent : null

  // Extracting publish timestamp
  const timestampElement = tweetElement.querySelector("time")
  const timestamp = timestampElement
    ? timestampElement.getAttribute("datetime")
    : null

  // Extracting the unique URL of the tweet
  const urlElement = tweetElement.querySelector('a[href*="/status/"]')
  const tweetURL = urlElement
    ? `https://twitter.com${urlElement.getAttribute("href")}`
    : null

  return { username, timestamp, tweetURL }
}

type Tweet = {
  username: string
  timestamp: string
  tweetURL: string
}

const BuySell: FC<PlasmoCSUIProps> = ({ anchor }) => {
  const [share, setShare] = useState(1)
  const [asset, setAsset] = useState(0)
  const [tweet, setTweet] = useState<Tweet>()

  useEffect(() => {
    const tweet = extractTweetData(anchor.element)
    setTweet(tweet)
  }, [])

  return (
    <div className="flex flex-row items-center flex-1 gap-2 p-2 pl-4">
      <div className="flex flex-row gap-2 ">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBuyShare(asset, share, tweet)}>
          Buy
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSellShare(asset, share)}>
          Sell
        </Button>
        <Button size="sm" variant="outline" onClick={() => uploadAsset(tweet)}>
          upload
        </Button>
      </div>
    </div>
  )
}
export default BuySell
