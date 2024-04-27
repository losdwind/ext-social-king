import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import cssText from "data-text:~style.css"
import { Plus, PlusSquareIcon } from "lucide-react"
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import { useEffect, useState } from "react"

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
  return Array.from(anchors)
    .map((element) => {
      if (element) {
        console.log({ element, insertPosition: "afterend" })
        return { element, insertPosition: "afterend" }
      }
      return null
    })
    .filter((item) => item !== null) // Ensure no null values are included
}

// export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
//   const anchors = document.querySelectorAll('article[role="article"]')
//   return Array.from(anchors).map((element) => {
//     console.log({ element, insertPosition: "afterend" })
//     return { element, insertPosition: "afterend" }
//   })
// }

const PlasmoInline = () => {
  const [share, setShare] = useState(1)
  const [totalValue, setTotalValue] = useState(0)
  const [price, setPrice] = useState(0)

  const getLatestPrice = () => {
    // Placeholder function to mimic fetching the latest price
    return 100 // Example static price
  }

  const getLatestTotalValue = () => {
    return getLatestPrice() * share
  }

  useEffect(() => {
    // Automatically update the price and total value when shares change
    setPrice(getLatestPrice())
    setTotalValue(getLatestTotalValue())
  }, [share]) // Depend on share to trigger updates

  return (
    <div className="flex flex-row items-center flex-1 gap-2 p-2">
      <div className="flex flex-row items-center gap-4">
        <Input
          value={share.toString()} // Convert number to string for the input field
          onChange={(e) => setShare(Number(e.target.value))} // Convert input string back to number
          // placeholder="Enter shares"
          className="w-20"
        />
        <Button
          onClick={() => setShare((prevShare) => prevShare + 1)} // Correctly handle increment
          size="sm"
          variant="outline">
          <Plus className="text-xs font-medium" />
        </Button>
      </div>
      <div className="flex flex-row justify-center flex-1 gap-4 ">
        <div className="text-xl font-medium">${totalValue.toFixed(2)}</div>
        <div className="text-xs font-light">
          <div>${price.toFixed(2)}</div>
          <div>
            for {share} share{share !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 ">
        <Button size="sm" variant="outline" onClick={() => onBuyShare()}>
          Buy
        </Button>
        <Button size="sm" variant="outline" onClick={() => onSellShare()}>
          Sell
        </Button>
      </div>
    </div>
  )
}

// Define these functions if they involve more complex logic
const onBuyShare = () => {
  console.log("Buying shares")
}

const onSellShare = () => {
  console.log("Selling shares")
}

export default PlasmoInline
