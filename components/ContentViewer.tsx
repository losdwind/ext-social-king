import React, { useEffect, useState } from "react"

// import ReactMarkdown from "react-markdown"

import { sendToBackground } from "@plasmohq/messaging"

function ContentViewer({ transactionId }) {
  const [content, setContent] = useState(null)
  const [contentType, setContentType] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await sendToBackground({
          name: "getPostData",
          body: {
            transactionId: transactionId
          },
          extensionId: process.env.PLASMO_EXTENSION_ID
        })

        if (res.error) {
          setError(res.error)
        } else {
          setContent(res.content)
          setContentType(res.contentType)
        }
      } catch (e) {
        setError("Failed to fetch data: " + e.message)
      }
      setLoading(false)
    }

    fetchData()
  }, [transactionId])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  // Render image if content type is image
  if (contentType.startsWith("image/")) {
    return <img src={content} alt="Content from Arweave" />
  }

  // Render markdown if content type is markdown
  if (contentType.startsWith("text/")) {
    return <p>{content}</p>
  }
}

export default ContentViewer
