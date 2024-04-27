import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PlasmoCSConfig } from "plasmo"

// import { ThirdwebProvider } from "thirdweb/react"

import { HomeTab } from "./home/HomeTab"

import "~style.css"

import { AuthButton } from "./home/AuthButton"

// export const config: PlasmoCSConfig = {
//   action: {
//     default_title: "Click to open panel"
//   }
// }

function IndexSidePanel() {
  return (
    <div>
      {/* <AuthButton /> */}
      <HomeTab />
    </div>
  )
}

export default IndexSidePanel
