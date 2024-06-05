import { PostList, type Creates } from "@/components/PostList"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Search, Wallet } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { privateKeyToAddress } from "viem/accounts"

import { sendToBackground } from "@plasmohq/messaging"
import { SecureStorage } from "@plasmohq/storage/secure"

const storage = new SecureStorage()

export type Creates = {
  id: string
  assetId: string
  arTxId: string
  sender: string
  blockNumber: string
  blockTimestamp: string
}
export type Trades = {
  id: string
  assetId: string
  arTxId: string
  sender: string
  blockNumber: string
  blockTimestamp: string
  creatorFee: string
  ethAmount: string
  tokenAmount: string
  tradeType: string
}

export function HomeTab() {
  const [latestCreates, setlatestCreates] = useState<Creates[]>([])
  const [userCreates, setUserCreates] = useState<Creates[]>([])
  const [userTrades, setUserTrades] = useState<Trades[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [address, setAddress] = useState("")

  storage.watch({
    pk: (c) => {
      setAddress(privateKeyToAddress(c.newValue))
    }
  })

  const getLatestCreates = async () => {
    setLoading(true)
    const { posts, error } = await sendToBackground({
      name: "getPosts",
      body: {}
    })
    setLoading(false)

    if (error) {
      setError(error)
    }
    setlatestCreates(posts)
  }

  const getUserCreates = async () => {
    setLoading(true)
    const { posts, error } = await sendToBackground({
      name: "getUserCreates",
      body: { address }
    })
    setLoading(false)
    if (error) {
      setError(error)
    }
    setUserCreates(posts)
  }

  const getUserTrades = async () => {
    setLoading(true)
    const { posts, error } = await sendToBackground({
      name: "getUserTrades",
      body: { address }
    })
    setLoading(false)
    if (error) {
      setError(error)
    }
    setUserTrades(posts)
  }

  useEffect(() => {
    setLoading(true)
    getLatestCreates()
    getUserCreates()
    getUserTrades
  }, [])

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-full">
        <Tabs defaultValue="latest">
          <div className="flex items-center px-4 py-2">
            {/* <LoginButton /> */}
            <Link to={"/wallet"}>
              <Avatar>
                <AvatarImage src={""} alt="Image" />
                <AvatarFallback>SK</AvatarFallback>
              </Avatar>
            </Link>
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
              <TabsTrigger
                value="my"
                className="text-zinc-600 dark:text-zinc-200">
                My
              </TabsTrigger>
              <TabsTrigger
                value="trades"
                className="text-zinc-600 dark:text-zinc-200">
                Trades
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
            <PostList items={latestCreates} />
          </TabsContent>
          <TabsContent value="hot" className="m-0">
            <PostList items={latestCreates.reverse()} />
          </TabsContent>
          <TabsContent value="king" className="m-0">
            <PostList items={latestCreates.slice(-3)} />
          </TabsContent>
          <TabsContent value="my" className="m-0">
            <PostList items={userCreates} />
          </TabsContent>
          <TabsContent value="trades" className="m-0">
            <PostList items={userTrades} />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
