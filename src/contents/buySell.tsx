import { time } from "console"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import cssText from "data-text:~style.css"
import { Plus } from "lucide-react"
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
  type Chain,
  type WriteContractParameters
} from "viem"
import { optimism } from "viem/chains"

import { sendToBackground } from "@plasmohq/messaging"

import { bodhiAbi } from "~core/bodhiAbi"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*"],
  world: "MAIN"
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)")
  return style
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const anchors = document.querySelectorAll('article[role="article"]')
  return Array.from(anchors).map((element) => {
    const username = "username"
    return { element, insertPosition: "afterend", data: { username } }
  })
}
// export const getShadowHostId: PlasmoGetShadowHostId = ({ element }) =>
//   element.getAttribute("data-custom-id") + `-pollax-iv`

// export const getRootContainer = () =>
//   document.querySelector('article[role="article"]')
// document.querySelector('[data-testid="tweet"]');

// Use this to optimize unmount lookups
// export const getShadowHostId = () =>
//   `plasmo-inline-example-unique-id-${tweet.username}`

const walletClient = createWalletClient({
  chain: optimism as Chain,
  transport: custom(window.ethereum)
})

var globalAccount = null

const onRequestAccount = async () => {
  console.log("onRequestAccount")
  const [account] = await walletClient.requestAddresses()
  globalAccount = account
  await sendToBackground({
    name: "syncAccount",
    body: {
      account: account
    },
    extensionId: process.env.PLASMO_EXTENSION_ID
  })
}

const onBuyShare = async (asset: number, share: number) => {
  console.log("onBuyShare")

  // await sendToBackground({
  //   name: "onBuyShare",
  //   body: {
  //     asset: asset,
  //     share: share
  //   },
  //   extensionId: process.env.PLASMO_EXTENSION_ID
  // })

  if (!globalAccount) {
    await onRequestAccount()
  }

  await walletClient.writeContract({
    address: "0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF",
    abi: bodhiAbi,
    functionName: "buy",
    args: [BigInt(asset), parseEther(share.toString())],
    account: globalAccount
  })
  console.log("Buying shares")
}

const onSellShare = async (asset: number, share: number) => {
  console.log("onSellShare")
  if (!globalAccount) {
    await onRequestAccount()
  }

  await walletClient.writeContract({
    address: "0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF",
    abi: bodhiAbi,
    functionName: "sell",
    args: [BigInt(asset), parseEther(share.toString())],
    account: globalAccount
  })
  console.log("Selling shares")
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
    console.log(tweet)
  }, [])

  return (
    <div className="flex flex-row items-center flex-1 gap-2 p-2 pl-4">
      <div className="flex flex-row gap-2 ">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBuyShare(asset, share)}>
          Buy
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSellShare(asset, share)}>
          Sell
        </Button>
      </div>
    </div>
  )
}
export default BuySell
