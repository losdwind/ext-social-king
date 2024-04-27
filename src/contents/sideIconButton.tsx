import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)")
  return style
}

const PlasmoOverlay = () => {
  return (
    <div className="fixed z-50 flex top-32">
      <Avatar>
        <AvatarImage
          src="../../assets/icon.png"
          alt="socialking logo"
          width={80}
          height={80}
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default PlasmoOverlay
