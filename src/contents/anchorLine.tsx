import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*"]
}

// // Use this to optimize unmount lookups
// // export const getShadowHostId = () => "inline-twitter-unique-id"

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
    // <div className="flex">
    // <button
    //   onClick={() => console.log("buy 1")}
    //   type="button"
    //   className="flex flex-row items-center px-4 py-2 text-sm transition-all border-none rounded-lg shadow-lg hover:shadow-md active:scale-105 bg-slate-50 hover:bg-slate-100 text-slate-800 hover:text-slate-900">
    //   Buy
    // </button>
    // <button
    //   onClick={() => console.log("buy 1")}
    //   type="button"
    //   className="flex flex-row items-center px-4 py-2 text-sm transition-all border-none rounded-lg shadow-lg hover:shadow-md active:scale-105 bg-slate-50 hover:bg-slate-100 text-slate-800 hover:text-slate-900">
    //   sell
    // </button>
    // </div>
    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-2.5 px-2 pb-2">
      <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5 p-2">
        <p className="flex-grow w-[792px] text-base font-medium text-left text-[#09090b]">
          $12.2
        </p>
        <p className="flex-grow-0 flex-shrink-0 text-xs font-light text-left text-[#09090b]">
          $0.11 for 0.5&nbsp;share
        </p>
      </div>
      <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2.5">
        <div className="flex justify-start items-start flex-grow gap-2.5">
          <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[91px] gap-1">
            <div
              className="flex items-center self-stretch justify-start flex-grow-0 flex-shrink-0 gap-2 px-3 py-2 overflow-hidden bg-white border rounded-md border-zinc-200"
              style={{ boxShadow: "0px 1px 2px 0 rgba(16,24,40,0.05)" }}>
              <div className="relative flex items-center justify-start flex-grow gap-2">
                <p className="flex-grow w-[67px] text-sm text-left text-zinc-500">
                  0.5
                </p>
              </div>
            </div>
          </div>
          <div
            className="relative flex items-center justify-center flex-grow-0 flex-shrink-0 overflow-hidden bg-white border rounded-md w-9 h-9 border-zinc-200"
            style={{ boxShadow: "0px 1px 2px 0 rgba(16,24,40,0.05)" }}>
            <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative flex-grow-0 flex-shrink-0 w-4 h-4"
              preserveAspectRatio="xMidYMid meet">
              <path
                d="M3.33337 7.99998H12.6667M8.00004 3.33331V12.6666"
                stroke="#18181B"
                stroke-width="1.33"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <div
          className="relative flex items-center justify-center flex-grow-0 flex-shrink-0 gap-2 px-4 py-2 overflow-hidden border rounded-md h-9 bg-zinc-100 border-zinc-300"
          style={{ boxShadow: "0px 1px 2px 0 rgba(16,24,40,0.05)" }}>
          <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#09090b]">
            Buy
          </p>
        </div>
        <div
          className="relative flex items-center justify-center flex-grow-0 flex-shrink-0 gap-2 px-4 py-2 overflow-hidden bg-white border rounded-md h-9 border-zinc-200"
          style={{ boxShadow: "0px 1px 2px 0 rgba(16,24,40,0.05)" }}>
          <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#09090b]">
            Sell
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlasmoInline
