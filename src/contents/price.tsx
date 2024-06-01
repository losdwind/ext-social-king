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
import { sepolia} from "viem/chains"

import { sendToBackground } from "@plasmohq/messaging"
import { SecureStorage } from "@plasmohq/storage/secure"

import { bodhiAbi } from "~core/bodhiAbi"
import { chainlinkAbi } from "~core/chainlinkAbi"

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
  chain: sepolia as Chain,
  transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
})

const storage = new SecureStorage()
var account: PrivateKeyAccount

const onRequestAccount = async () => {
  const storage = new SecureStorage()
  const savedAccount = await storage.get("account")
  console.log("saved Account", savedAccount)
  if (savedAccount) {
    return savedAccount
  }
  // const privateKey = generatePrivateKey()
  const privateKey = process.env.PLASMO_PUBLIC_PRIVATE_KEY

  account = privateKeyToAccount(privateKey)

  await storage.setPassword("123456") // The only diff

  await storage.set("pk", privateKey)
  await storage.set("account", account)
  console.log("init account", account)
  return account
}

const onFirstCreate = async (tweet: Tweet) => {
  if (!account) {
    await onRequestAccount()
  }
  const walletClient = createWalletClient({
    account,
    chain: sepolia as Chain,
    transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
  })

  const createResult = await walletClient.writeContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: bodhiAbi,
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
    chain: sepolia as Chain,
    transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
  })

  const buyPrice = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: bodhiAbi,
    functionName: "getBuyPriceAfterFee",
    args: [assetId, parseEther(share.toString())]
  })
  await walletClient.writeContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: bodhiAbi,
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
    chain: sepolia as Chain,
    transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
  })

  await walletClient.writeContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: bodhiAbi,
    functionName: "sell",
    args: [assetId, parseEther(share.toString())],
    account: account
  })
  console.log("Selling shares")
}

const getAssetId = async (tweetURL) => {
  const assetId = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: bodhiAbi,
    functionName: "txToAssetId",
    args: [keccak256(encodePacked(['string'],
      [toHex(tweetURL)]
    ))]
  })
  console.log("assetId",assetId)
  return assetId
}

const getBuyPrice = async (assetId, share) => {
  console.log("getBuyPriceAfterFee")
  const buyPrice = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: bodhiAbi,
    functionName: "getBuyPriceAfterFee",
    args: [assetId, parseEther(share.toString())]
  })
  return formatEther(buyPrice)
}

const getPool = async (assetId: bigint) => {
  console.log("getPool")
  const value = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: bodhiAbi,
    functionName: "pool",
    args: [assetId]
  })
  return formatEther(value)
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
  const [tweet, setTweet] = useState<Tweet>()
  const [isShowFirstBuy, setIsShowFirstBuy] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      // Automatically update the price and total value when shares change
      const tweet = extractTweetData(anchor.element)
      setTweet(tweet)
      const assetId = await getAssetId(tweet.tweetURL)
      console.log(assetId != 0n)
      setAssetId(assetId)
      if (assetId != 0n) {
        const currentPrice = await getBuyPrice(assetId, share)
        const pool = await getPool(assetId)
        setPrice(currentPrice)
        setTotalValue(pool)
      } else {
        setIsShowFirstBuy(true)
      }
    }

    fetch()
  }, [share]) // Depend on share to trigger updates

  return (
    <div className="flex flex-row items-center flex-1 gap-2 p-2 pl-4">
      <div className="flex flex-row gap-2 ">
      {/* <Button size="sm" onClick={() => onClickBind}>Bind</Button> */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBuyShare(assetId, share, tweet)}>
          Buy
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSellShare(assetId, share)}>
          Sell
        </Button>
      </div>
      {isShowFirstBuy ? (
        <Button
          size="sm"
          onClick={async () => {
            onFirstCreate(tweet)
            setIsShowFirstBuy(false)
          }}>
          Be the first Buyer
        </Button>
      ) : (
        <div>
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
      ) }
    </div>
  )
}
export default Price
