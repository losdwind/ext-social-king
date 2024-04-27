import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Search } from "lucide-react"

import { posts } from "~sidepanel/home/mockData"

// import { AuthButton } from "./AuthButton"
import { PostList } from "./PostList"

// import { AuthButton } from "./ThirdWebAuth"

export function HomeTab() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tabs defaultValue="latest">
        <div className="flex items-center px-4 py-2">
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
          <PostList items={posts.filter((item) => !item.read)} />
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  )
}
