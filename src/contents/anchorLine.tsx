import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*"]
}

// // Use this to optimize unmount lookups
// // export const getShadowHostId = () => "plasmo-inline-twitter-unique-id"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const anchors = document.querySelectorAll('article[role="article"]')
  return Array.from(anchors).map((element) => {
    // const element = element.querySelector('[role="group"]')
    if (element) {
      console.log({ element, insertPosition: "afterend" })
      return { element, insertPosition: "afterend" }
    }
  })
}

const PlasmoInline = () => {
  return (
    <div className="plasmo-flex">
    <button
      onClick={() => console.log("buy 1")}
      type="button"
      className="plasmo-flex plasmo-flex-row plasmo-items-center plasmo-px-4 plasmo-py-2 plasmo-text-sm plasmo-rounded-lg plasmo-transition-all plasmo-border-none plasmo-shadow-lg hover:plasmo-shadow-md active:plasmo-scale-105 plasmo-bg-slate-50 hover:plasmo-bg-slate-100 plasmo-text-slate-800 hover:plasmo-text-slate-900">
      Buy
    </button>
    <button
      onClick={() => console.log("buy 1")}
      type="button"
      className="plasmo-flex plasmo-flex-row plasmo-items-center plasmo-px-4 plasmo-py-2 plasmo-text-sm plasmo-rounded-lg plasmo-transition-all plasmo-border-none plasmo-shadow-lg hover:plasmo-shadow-md active:plasmo-scale-105 plasmo-bg-slate-50 hover:plasmo-bg-slate-100 plasmo-text-slate-800 hover:plasmo-text-slate-900">
      sell
    </button>
    </div>
  )
}

export default PlasmoInline
