import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import type { ComponentProps } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import PostCard from "./PostCard"
import { Link } from "react-router-dom"

export type Post = {
  id: string
  assetId: string
  arTxId: string
  sender: string
  blockNumber: string
  blockTimestamp: string
}

interface PostListProps {
  items: Post[]
}

export function PostList({ items }: PostListProps) {
  const [selected, setSelected] = useStorage<string>("selectedPost", null)

  return (
    <ScrollArea>
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <Link className="block" to={`/detail/${item.arTxId}`}>
            <PostCard post={item} key={item.id} />
          </Link>
        ))}
      </div>
    </ScrollArea>
  )
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default"
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline"
  }

  return "secondary"
}
