import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import cssText from "data-text:~style.css"
import { Plus } from "lucide-react"
import { type PlasmoCSConfig, type PlasmoGetInlineAnchorList } from "plasmo"
import { useEffect, useState } from "react"
import { bodhiAbi } from "~core/bodhiAbi"

import { createPublicClient, createWalletClient, custom, formatEther, http, parseEther, verifyMessage, type Chain, type WriteContractParameters } from "viem"
import { optimism } from "viem/chains"
import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*"],
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

const getBuyPrice = async (asset, share) => {
  console.log("getBuyPrice")
  const buyPrice = await publicClient.readContract({
    address: "0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF",
    abi: bodhiAbi,
    functionName: "getBuyPrice",
    args: [BigInt(asset), parseEther(share.toString())]
  })
  return formatEther(buyPrice)
}

const getPool = async (asset: number) => {
  console.log("getPool")
  const value = await publicClient.readContract({
    address: "0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF",
    abi: bodhiAbi,
    functionName: "pool",
    args: [BigInt(asset)]
  })
  return formatEther(value)
}


const Price = () => {
  const [share, setShare] = useState(1)
  const [asset, setAsset] = useState(0)
  const [totalValue, setTotalValue] = useState("")
  const [price, setPrice] = useState("")

  useEffect(() => {
    const fetch = async () => {
      // Automatically update the price and total value when shares change

      const currentPrice = await getBuyPrice(asset, share)
      const pool = await getPool(asset)
      setPrice(currentPrice)
      setTotalValue(pool)
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
      </div>
      <div className="flex flex-row justify-center flex-1 gap-4 ">
        <div className="text-xl font-medium">{parseFloat(totalValue).toFixed(4)}ETH</div>
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
