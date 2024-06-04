import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import cssText from "data-text:~style.css"
import { Loader2, Plus } from "lucide-react"
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
  encodePacked,
  formatEther,
  http,
  keccak256,
  parseEther,
  stringToBytes,
  toBytes,
  toHex,
  verifyMessage,
  type Chain,
  type PrivateKeyAccount,
  type WriteContractParameters
} from "viem"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { polygonAmoy } from "viem/chains"

import { Storage } from "@plasmohq/storage"

import { maticToUSDAbi } from "~core/maticToUSDAbi"
import { socialKingAbi } from "~core/socialKingAbi"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*","https://x.com/*"]
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
  chain: polygonAmoy as Chain,
  transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
})

var account: PrivateKeyAccount

const onRequestAccount = async () => {
  const storage = new Storage()
  const savePrivateKey = await storage.get("pk")
  console.log("saved savePrivateKey", savePrivateKey)
  if (savePrivateKey) {
    account = privateKeyToAccount(savePrivateKey)
  } else {
    console.log("no savePrivateKey, please reinstall the extension")
  }
}

const onFirstCreate = async (tweet: Tweet) => {
  if (!account) {
    await onRequestAccount()
  }
  const walletClient = createWalletClient({
    account,
    chain: polygonAmoy as Chain,
    transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
  })

  const createResult = await walletClient.writeContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "create",
    args: [toHex(tweet.tweetURL), toHex(tweet.username)],
    account: account
  })
  console.log("create Result", createResult)
}

const onBuyShare = async (assetId: bigint, share: number, tweet: Tweet) => {
  console.log("onBuyShare")
  if (!account) {
    await onRequestAccount()
  }

  const walletClient = createWalletClient({
    account,
    chain: polygonAmoy as Chain,
    transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
  })

  const buyPrice = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "getBuyPriceAfterFee",
    args: [assetId, parseEther(share.toString())]
  })
  await walletClient.writeContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "buy",
    args: [assetId, parseEther(share.toString())],
    account: account,
    value: buyPrice
  })

  console.log("Buying shares")
}

const onSellShare = async (assetId: bigint, share: number) => {
  console.log("onSellShare")
  if (!account) {
    await onRequestAccount()
  }
  const walletClient = createWalletClient({
    account,
    chain: polygonAmoy as Chain,
    transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
  })

  await walletClient.writeContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "sell",
    args: [assetId, parseEther(share.toString())],
    account: account
  })
  console.log("Selling shares")
}

const getAssetId = async (tweetURL) => {
  const assetId = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "txToAssetId",
    args: [keccak256(encodePacked(["string"], [toHex(tweetURL)]))]
  })
  console.log("assetId", assetId)
  return assetId
}

const getBuyPrice = async (assetId, share) => {
  console.log("getBuyPriceAfterFee")
  const buyPrice = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "getBuyPriceAfterFee",
    args: [assetId, parseEther(share.toString())]
  })
  return formatEther(buyPrice)
}

const getPool = async (assetId: bigint) => {
  console.log("getPool")
  setTimeout(()=>{}, 5000)
  const value = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "pool",
    args: [assetId]
  })
  console.log("get pool", value)
  return formatEther(value)
}

const getUSDPrice = async () => {
  console.log("getUSDPrice")
  const usdPrice = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CHAINLINK_USD_CONTRACT_ADDRESS,
    abi: maticToUSDAbi,
    functionName: "getChainlinkDataFeedLatestAnswer",
    args: []
  })
  return Number(usdPrice) / 100000000.0
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
  const [assetId, setAssetId] = useState<bigint>()
  const [totalValue, setTotalValue] = useState("0")
  const [price, setPrice] = useState("0")
  const [isShowFirstBuy, setIsShowFirstBuy] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const [isSelling, setIsSelling] = useState(false)

  const [isLoadingFirstBuy, setIsLoadingFirstBuy] = useState(false)

  const tweet = extractTweetData(anchor.element)
  var usdPrice = 0.69
  getUSDPrice().then((price) => {
    usdPrice = price
  })
  const fetch = async () => {
    const assetId = await getAssetId(tweet.tweetURL)
    setAssetId(assetId)
    if (assetId > 0n) {
      const currentPrice = await getBuyPrice(assetId, share)
      const pool = await getPool(assetId)
      setPrice(currentPrice)
      setTotalValue(pool)
    } else {
      setIsShowFirstBuy(true)
    }
  }

  useEffect(() => {
    fetch()
  }, [share])

  return (
    <div className="flex flex-row items-center justify-between flex-1 gap-2 p-2 pl-4">
      <div className="flex flex-row gap-2 items-center justify-center">
        {/* <div className="flex-shrink-0">
          <p>Asset ID:{Number(assetId)}</p>
        </div> */}
        <Button
          size="sm"
          variant="outline"
          disabled={isBuying}
          onClick={async () => {
            setIsBuying(true)
            await onBuyShare(assetId, share, tweet)
            const currentPrice = await getBuyPrice(assetId, share)
            const pool = await getPool(assetId)
            setPrice(currentPrice)
            setTotalValue(pool)
            setIsBuying(false)
          }}>
          {isBuying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Buy
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isSelling}
          onClick={async () => {
            setIsSelling(true)
            await onSellShare(assetId, share)
            const currentPrice = await getBuyPrice(assetId, share)
            const pool = await getPool(assetId)
            setPrice(currentPrice)
            setTotalValue(pool)
            setIsSelling(false)
          }}>
          {isSelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sell
        </Button>
      </div>
      {isShowFirstBuy ? (
        <Button
          size="sm"
          disabled={isLoadingFirstBuy}
          onClick={async () => {
            setIsLoadingFirstBuy(true)
            await onFirstCreate(tweet)
            const assetId = await getAssetId(tweet.tweetURL)
            setAssetId(assetId)
            const currentPrice = await getBuyPrice(assetId, share)
            const pool = await getPool(assetId)
            setPrice(currentPrice)
            setTotalValue(pool)
            setIsLoadingFirstBuy(false)
            setIsShowFirstBuy(false)
          }}
          className="flex-grow">
          {isLoadingFirstBuy && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Be the first buyer, get 1% reward
        </Button>
      ) : (
        <div className="flex flex-row w-full gap-2">
          <div className="flex flex-row items-center gap-2">
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
            <div className="text-xs font-light">
              <div>{(parseFloat(price) * usdPrice).toFixed(4)} USD</div>
              <div>
                for {share} share{share !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2 ml-auto mr-4">
            <div className="text-xl font-medium">
              {(parseFloat(totalValue) * usdPrice).toFixed(4)} USD
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Price
