import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import cssText from "data-text:~style.css"
import { Plus, PlusSquareIcon } from "lucide-react"
import { type PlasmoCSConfig, type PlasmoGetInlineAnchorList } from "plasmo"
import { useEffect, useState } from "react"
import type { Address } from "viem"

import {
  getLatestPrice,
  getLatestTotalValue,
  onBuyShare,
  onSellShare
} from "../../lib/viem"
import { LoginButton } from "../sidepanel/login"

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

const PlasmoInline = () => {
  const [share, setShare] = useState(1e18)
  const [asset, setAsset] = useState(0)
  const [totalValue, setTotalValue] = useState("")
  const [price, setPrice] = useState("")
  const [account, setAccount] = useState<Address>()

  useEffect(() => {
    const fetch = async () => {
      // Automatically update the price and total value when shares change
      const price = await getLatestPrice(asset, share)
      // console.log(`price ===> ${price}`)

      const value = await getLatestTotalValue(asset)
      // console.log(`value ===> ${value}`)

      setPrice(price.toString())
      setTotalValue(value.toString())
    }

    fetch()
  }, [share]) // Depend on share to trigger updates

  return (
    <div className="flex flex-row items-center flex-1 gap-2 p-2 pl-4">
      <div className="flex flex-row items-center gap-4">
        <Input
          value={share.toString()} // Convert number to string for the input field
          onChange={(e) => setShare(Number(e.target.value))} // Convert input string back to number
          // placeholder="Enter shares"
          className="w-20 h-9"
        />
        <Button
          onClick={() => setShare((prevShare) => prevShare + 1)} // Correctly handle increment
          size="sm"
          variant="outline">
          <Plus className="text-xs font-medium" />
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
          onClick={() => onBuyShare(account, asset, share)}>
          Buy
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSellShare(account, asset, share)}>
          Sell
        </Button>
      </div>
    </div>
  )
}
export default PlasmoInline
