import type internal from "stream"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import cssText from "data-text:~style.css"
import { Plus, PlusSquareIcon } from "lucide-react"
import { type PlasmoCSConfig, type PlasmoGetInlineAnchorList } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import {
  createPublicClient,
  createWalletClient,
  custom,
  getAddress,
  getContract,
  http,
  type Address,
  type Chain,
  type PublicClient,
  type WalletClient
} from "viem"
import { optimism } from "viem/chains"

import { Storage } from "@plasmohq/storage"

import { bodhiAbi } from "~abi/bodhiAbi"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*"],
  world:"MAIN"
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)")
  return style
}

const publicClient = createPublicClient({
  chain: optimism as Chain,
  transport: http(
    "https://rpc.particle.network/evm-chain?chainId=1&projectUuid=5cf89b55-8b00-4c19-9844-7729a490a5a2&projectKey=cR2VL9YnJzoWbT2Zgow5W728kUecEuTciTpwKBQO"
  )
})

const walletClient = createWalletClient({
  chain: optimism as Chain,
  transport:custom(window.ethereum)
})

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const anchors = document.querySelectorAll('article[role="article"]')
  return Array.from(anchors).map((element) => {
    return { element, insertPosition: "afterend" }
  })
}

// // 2. Call contract methods, fetch events, listen to events, etc.
// const result = await contract.read.totalSupply()
// const logs = await contract.getEvents.Transfer()
// const unwatch = contract.watchEvent.Transfer(
//   { from: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e' },
//   { onLogs(logs) { console.log(logs) } }
// )

const getBuyPrice = async (asset, share) => {
  const price = await sendToBackground({
    name: "getLatestPrice",
    body: {
      asset: asset,
      share: share * 1e18
    },
    extensionId: process.env.PLASMO_EXTENSION_ID
  })
  return price
}

const getPool = async (asset: number) => {
  const pool = await sendToBackground({
    name: "getPool",
    body: {
      asset: asset
    },
    extensionId: process.env.PLASMO_EXTENSION_ID
  })
  return pool
}

const onBuyShare = async (account: Address, asset: number, share: number) => {
  // await sendToBackground({
  //   name: "onBuyShare",
  //   body: {
  //     account: account,
  //     asset: asset,
  //     share: share
  //   },
  //   extensionId: process.env.PLASMO_EXTENSION_ID
  // })
  if (!account) {
    const [account] = await walletClient.requestAddresses()
    // setAccount(account)
  }
  const { request } = await publicClient.simulateContract({
    account,
    address: "0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF",
    abi: bodhiAbi,
    functionName: "buy",
    args: [BigInt(asset), BigInt(share)]
  })
  await walletClient.writeContract(request)
  console.log("Buying shares")
}

const onSellShare = async (account: Address, asset: number, share: number) => {
  // await sendToBackground({
  //   name: "onSellShare",
  //   body: {
  //     account: account,
  //     asset: asset,
  //     share: share
  //   },
  //   extensionId: process.env.PLASMO_EXTENSION_ID
  // })

  if (!account) {
    const [account] = await walletClient.requestAddresses()
    // setAccount(account)
  }

  const { request } = await publicClient.simulateContract({
    account,
    address: "0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF",
    abi: bodhiAbi,
    functionName: "sell",
    args: [BigInt(asset), BigInt(share)]
  })

  await walletClient.writeContract(request)
  console.log("Selling shares")
}

const PlasmoInline = () => {
  const [share, setShare] = useState(1)
  const [asset, setAsset] = useState(0)
  const [totalValue, setTotalValue] = useState("")
  const [price, setPrice] = useState("")

  useEffect(() => {
    const fetch = async () => {
      // Automatically update the price and total value when shares change

      const price = await getBuyPrice(asset, share)
      console.log(`price ===> ${price}`)

      const pool = await getPool(asset)

      console.log(`value ===> ${pool}`)

      setPrice(price)
      setTotalValue(totalValue)
    }

    fetch()
  }, [share]) // Depend on share to trigger updates

  return (
    <div className="flex flex-row items-center flex-1 gap-2 p-2 pl-4">
      <div className="flex flex-row items-center gap-4">
        <Input
          value={share} // Convert number to string for the input field
          onChange={(e) => setShare(Number(e.target.value))} // Convert input string back to number
          // placeholder="Enter shares"
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
        <div className="text-xl font-medium">${totalValue}</div>
        <div className="text-xs font-light">
          <div>${price}</div>
          <div>
            for {share} share{share !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 ">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBuyShare(null, asset, share)}>
          Buy
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSellShare(null, asset, share)}>
          Sell
        </Button>
      </div>
    </div>
  )
}
export default PlasmoInline
