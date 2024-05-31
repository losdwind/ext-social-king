import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import cssText from "data-text:~style.css"
import { Plus } from "lucide-react"
import {
  type PlasmoCSConfig,
  type PlasmoCSUIProps,
  type PlasmoGetInlineAnchorList
} from "plasmo"
import { useEffect, useState, type FC } from "react"
import {
  createPublicClient,
  createWalletClient,
  custom,
  formatEther,
  http,
  parseEther,
  toHex,
  verifyMessage,
  type Chain,
  type WriteContractParameters
} from "viem"
import { optimism } from "viem/chains"

import { sendToBackground } from "@plasmohq/messaging"

import { bodhiAbi } from "~core/bodhiAbi"

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

const publicClient = createPublicClient({
  chain: optimism as Chain,
  transport: http()
})

const onRequestTxId = async (tweet) => {
  const txId = await sendToBackground({
    name: "getTxId",
    body: {
      tweet: tweet
    },
    extensionId: process.env.PLASMO_PUBLIC_EXTENSION_ID
  })
  return txId
}

const onRequestAssetId = async (txId: string) => {
  const assetId = await sendToBackground({
    name: "getAssetId",
    body: {
      txId: txId
    },
    extensionId: process.env.PLASMO_PUBLIC_EXTENSION_ID
  })
  return assetId
}

const getBuyPrice = async (asset, share) => {
  console.log("getBuyPrice")
  const buyPrice = await publicClient.readContract({
    address: toHex(process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS),
    abi: bodhiAbi,
    functionName: "getBuyPrice",
    args: [BigInt(asset), parseEther(share.toString())]
  })
  return formatEther(buyPrice)
}

const getPool = async (asset: number) => {
  console.log("getPool")
  const value = await publicClient.readContract({
    address: toHex(process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS),
    abi: bodhiAbi,
    functionName: "pool",
    args: [BigInt(asset)]
  })
  return formatEther(value)
}

const testAccount = async () => {
  const account = await sendToBackground({
    name: "testMainWorld",
    extensionId: process.env.PLASMO_PUBLIC_EXTENSION_ID
  })
  return account
}

type Tweet = {
  username: string
  timestamp: string
  tweetURL: string
}

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

const Price: FC<PlasmoCSUIProps> = ({ anchor }) => {
  const [share, setShare] = useState(1)
  const [asset, setAsset] = useState()
  const [totalValue, setTotalValue] = useState("0")
  const [price, setPrice] = useState("0")
  const [tweet, setTweet] = useState<Tweet>()

  useEffect(() => {
    const fetch = async () => {
      // Automatically update the price and total value when shares change
      const tweet = extractTweetData(anchor.element)
      setTweet(tweet)
      const res = await onRequestTxId(tweet)

      if (res.txId) {
        const assetId = await onRequestAssetId(res.txId)
        const currentPrice = await getBuyPrice(assetId, share)
        const pool = await getPool(asset)
        setPrice(currentPrice)
        setTotalValue(pool)
      }
    }

    fetch()
  }, [share]) // Depend on share to trigger updates

  return (
    <div className="flex flex-row items-center flex-1 gap-2 p-2 pl-4">
      <div className="flex flex-row items-center gap-4">
        <Input
          value={share} // Convert number to string for the input field
          onChange={(e) => setShare(Number(e.target.value))}
          className="w-20 h-9"
        />
        <Button
          onClick={() => setShare((prevShare) => prevShare + 1)} // Correctly handle increment
          size="sm"
          variant="outline">
          <Plus className="text-xs font-thin" />
        </Button>
        <Button
          onClick={async () => {
            const account = await testAccount()
            console.log("account", account)
            return account
          }}>
          Test Account Link
        </Button>
      </div>
      <div className="flex flex-row justify-center flex-1 gap-4 ">
        <div className="text-xl font-medium">
          {parseFloat(totalValue).toFixed(4)}ETH
        </div>
        <div className="text-xs font-light">
          <div>{parseFloat(price).toFixed(4)} ETH</div>
          <div>
            for {share} share{share !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Price
