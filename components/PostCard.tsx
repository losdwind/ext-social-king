/**
 * v0 by Vercel.
 * @see https://v0.dev/t/3J1DIpTinug
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { transactionType } from "viem"

import { AddressDisplay } from "./AddressDisplay"
import ContentViewer from "./ContentViewer"
import type { Post } from "./PostList"

interface PostProps {
  post: Post
}

export default function Post({ post }: PostProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-950 p-4 md:p-6 rounded-lg  overflow-auto max-h-[80vh]">
      <ul className="">
        <li>
          <div className="max-w-md mx-auto rounded-lg dark:bg-gray-950">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">
                  <AddressDisplay address={post.sender} />
                </span>
                | Post #${post.assetId}
                {"\n                        "}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                April 27, 2024
              </div>
            </div>
            <Link className="block mb-4" to={`/detail/${post.arTxId}`}>
              <ContentViewer transactionId={post.arTxId} />
            </Link>
{/* 
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-gray-700 dark:text-gray-300">
                Current Value: $1,250
              </div>
              <div className="font-medium text-gray-700 dark:text-gray-300">
                $5.00 per share
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Input
                className="flex-1"
                placeholder="Enter amount"
                type="number"
              />
              <Button variant="default">Buy</Button>
              <Button variant="secondary">Sell</Button>
            </div> */}
          </div>
        </li>
      </ul>
    </div>
  )
}
