/**
 * v0 by Vercel.
 * @see https://v0.dev/t/3J1DIpTinug
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { moveMessagePortToContext } from "worker_threads"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fromUnixTime } from "date-fns"
import { Link } from "react-router-dom"
import { transactionType } from "viem"

import { AddressDisplay } from "./AddressDisplay"
import ContentViewer from "./ContentViewer"
import SocialLinkViewer, {
  extractUsername,
  hexToString
} from "./SocialLinkViewer"
import type { Creates } from "~sidepanel/home"

interface PostProps {
  post: Creates
}

export default function Post({ post }: PostProps) {
  console.log("post", post)
  return (
    <div className="bg-gray-100 dark:bg-gray-950 p-4 md:p-6 rounded-lg  overflow-auto max-h-[80vh]">
      <ul className="">
        <li>
          <div className="max-w-md mx-auto rounded-lg dark:bg-gray-950">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">
                  <AddressDisplay address={post.sender} /> | Post #
                  {post.assetId}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {fromUnixTime(Number(post.blockTimestamp)).toDateString()}
              </div>
            </div>
            <SocialLinkViewer hexString={post.arTxId} />
          </div>
        </li>
      </ul>
    </div>
  )
}
