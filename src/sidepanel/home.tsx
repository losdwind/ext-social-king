import { PostList, type Post } from "@/components/PostList"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Search } from "lucide-react"
import React, { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { storage } from "~sidepanel"

import { LoginButton } from "./login"

// import a from "data-base64:~assets/avatars/a.png"

export function HomeTab() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [account, setAccount] = useState("")

  storage.watch({
    account: (c) => {
      setAccount(c.newValue)
    }
  })

  useEffect(() => {
    setLoading(true)

    const getPosts = async () => {
      setLoading(true)
      const { posts, error } = await sendToBackground({
        name: "getPosts",
        body: {},
        extensionId: process.env.PLASMO_EXTENSION_ID
      })
      setLoading(false)

      if (error) {
        setError(error)
      }

      const formatedPosts = posts.map((post: any) => ({
        id: post.id,
        assetId: post.assetId,
        arTxId: post.arTxId,
        sender: post.sender
      }))
      setPosts(formatedPosts)
    }
    getPosts()
  }, [])
  // if (loading) return <div className="flex m-auto">Loading...</div>
  // if (error) return <div className="flex m-auto">Error: {error}</div>

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-full">
        <Tabs defaultValue="latest">
          <div className="flex items-center px-4 py-2">
            {/* <LoginButton /> */}
            <Avatar>
              <AvatarImage src={""} alt="Image" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
            <TabsList className="ml-auto">
              <TabsTrigger
                value="latest"
                className="text-zinc-600 dark:text-zinc-200">
                Latest
              </TabsTrigger>
              <TabsTrigger
                value="hot"
                className="text-zinc-600 dark:text-zinc-200">
                Hot
              </TabsTrigger>
              <TabsTrigger
                value="king"
                className="text-zinc-600 dark:text-zinc-200">
                King
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
          <TabsContent value="hot" className="m-0">
            <PostList items={posts.reverse()} />
          </TabsContent>
          <TabsContent value="king" className="m-0">
            <PostList items={posts.slice(-3)} />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
