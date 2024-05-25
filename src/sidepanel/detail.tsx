import { AddressDisplay } from "@/components/AddressDisplay"
import ContentViewer from "@/components/ContentViewer"
import PostCard from "@/components/PostCard"
import type { Post } from "@/components/PostList"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ArrowLeftIcon } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import Chart from "./chart"

export function Detail() {
  const { id } = useParams()
  console.log(id)
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-full">
        <Tabs defaultValue="content">
          <div className="flex flex-row items-center px-4 py-2">
            <Button onClick={handleBackClick} variant="ghost" size="sm">
              <ArrowLeftIcon />
            </Button>
            <TabsList className="ml-auto">
              <TabsTrigger
                value="content"
                className="text-zinc-600 dark:text-zinc-200">
                Content
              </TabsTrigger>
              <TabsTrigger
                value="chart"
                className="text-zinc-600 dark:text-zinc-200">
                Chart
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <TabsContent value="content" className="m-0">
            <div className="max-w-md mx-auto rounded-lg dark:bg-gray-950">
              {/* <div className="flex items-center justify-between mb-4">
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
              </div> */}
              <ContentViewer transactionId={id} />
            </div>
          </TabsContent>
          <TabsContent value="chart" className="m-0">
            <Chart />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
