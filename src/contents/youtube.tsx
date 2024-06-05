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

import { socialKingAbi } from "~core/socialKingAbi"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)")
  return style
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  // Target the container that usually houses interactive elements like 'Subscribe'
  const videoCards = document.querySelectorAll("ytd-rich-grid-media")

  return Array.from(videoCards).map((element) => {
    // Assuming you want to insert your custom UI after this container
    return { element, insertPosition: "beforeend" }
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

const onFirstCreate = async (youtubeVideo: YouTubeVideo) => {
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
    args: [toHex(youtubeVideo.videoURL), toHex(youtubeVideo.channelName)],
    account: account
  })
  console.log("create Result", createResult)
}

const onBuyShare = async (
  assetId: bigint,
  share: number,
  youtubeVideo: YouTubeVideo
) => {
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

const getAssetId = async (youtubeVideoURL) => {
  const assetId = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "txToAssetId",
    args: [keccak256(encodePacked(["string"], [toHex(youtubeVideoURL)]))]
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
  const value = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "pool",
    args: [assetId]
  })
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

type YouTubeVideo = {
  channelName: string
  timestamp: string
  videoURL: string
}

function extractVideoDetails(youtubeVideoElement): YouTubeVideo {
  // Initialize an object to store the extracted data
  var videoDetails: YouTubeVideo
  // Extracting the channel name
  // Extract the channel name
  const channelNameElement = youtubeVideoElement.querySelector(
    "yt-formatted-string.style-scope.ytd-channel-name.complex-string"
  )
  const channelName = channelNameElement
    ? channelNameElement.textContent.trim()
    : null

  // Extract the video URL
  const videoUrlElement =
    youtubeVideoElement.querySelector("a#video-title-link")
  const videoUrl = videoUrlElement
    ? "https://www.youtube.com" + videoUrlElement.getAttribute("href")
    : null

  // Extract the timestamp
  const timestampElement = youtubeVideoElement.querySelector(
    "span.inline-metadata-item.style-scope.ytd-video-meta-block"
  )
  const timestamp = timestampElement
    ? timestampElement.textContent.trim()
    : null

  return {
    channelName: channelName,
    videoUrl: videoUrl,
    timestamp: timestamp
  }

  // Extracting the video URL
  const videoLinkElement =
    youtubeVideoElement.querySelector("a#video-title-link")
  if (videoLinkElement) {
    videoDetails.videoURL =
      "https://www.youtube.com" + videoLinkElement.getAttribute("href")
  }

  return videoDetails
}

const Youtubes: FC<PlasmoCSUIProps> = ({ anchor }) => {
  const [share, setShare] = useState(1)
  const [assetId, setAssetId] = useState<bigint>()
  const [totalValue, setTotalValue] = useState("0")
  const [price, setPrice] = useState("0")
  const [isShowFirstBuy, setIsShowFirstBuy] = useState(true)
  const [isBuying, setIsBuying] = useState(false)
  const [isSelling, setIsSelling] = useState(false)

  const [isLoadingFirstBuy, setIsLoadingFirstBuy] = useState(false)
  // Automatically update the price and total value when shares change
  const youtubeVideo = extractVideoDetails(anchor.element)

  console.log("youtubeVideo", youtubeVideo)
  var usdPrice = 0.69
  // getUSDPrice().then((price) => {
  //   usdPrice = price
  // })
  const fetch = async () => {
    const assetId = await getAssetId(youtubeVideo.videoURL)
    setAssetId(assetId)
    if (assetId > 0n) {
      const currentPrice = await getBuyPrice(assetId, share)
      const pool = await getPool(assetId)
      setPrice(currentPrice)
      setTotalValue(pool)
      setIsShowFirstBuy(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [share]) // Depend on share to trigger updates

  return (
    <div className="flex flex-row items-center justify-between flex-1 gap-2 p-2 pl-4">
      <div className="flex flex-row gap-2 items-center justify-center">
        <Button
          size="sm"
          variant="outline"
          disabled={isBuying}
          onClick={async () => {
            setIsBuying(true)
            await onBuyShare(assetId, share, youtubeVideo)
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
          onClick={async () => {
            setIsLoadingFirstBuy(true)
            await onFirstCreate(youtubeVideo)
            const assetId = await getAssetId(youtubeVideo.videoURL)
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
          <div className="flex flex-row flex-1 items-center gap-2 ml-auto mr-4">
            <div className="text-xl font-medium">
              {(parseFloat(totalValue) * usdPrice).toFixed(4)} USD
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Youtubes
