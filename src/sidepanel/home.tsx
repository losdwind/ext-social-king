import { PostList, type Post } from "@/components/PostList"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Search } from "lucide-react"
import React, { useEffect, useState } from "react"

import { LoginButton } from "./login"

export function HomeTab() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    chrome.runtime.sendMessage({ type: "FETCH_DATA" }, (response) => {
      if (response.error) {
        setError(response.error)
        setLoading(false)
      } else {
        setPosts(
          response.data.data.creates.map((post: any) => ({
            id: post.id,
            assetId: post.assetId,
            arTxId: post.arTxId,
            sender: post.sender
          }))
        )
        setLoading(false)
      }
    })
    console.log(posts)
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col max-h-screen overflow-hidden">
        <Tabs defaultValue="latest">
          <div className="flex items-center px-4 py-2">
            <LoginButton />
            <TabsList className="ml-auto">
              <TabsTrigger
                value="latest"
                className="text-zinc-600 dark:text-zinc-200">
                Latest
              </TabsTrigger>
              <TabsTrigger
                value="top"
                className="text-zinc-600 dark:text-zinc-200">
                Top
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
              </div>
            </form>
          </div>
          <TabsContent value="latest" className="m-0">
            <PostList items={posts} />
          </TabsContent>
          <TabsContent value="top" className="m-0">
            <PostList items={posts.filter((item) => item)} />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
