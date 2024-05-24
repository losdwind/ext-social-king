import React, { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import ReactMarkdown from "react-markdown"

function ArweaveMarkdownViewer({ transactionId }) {
  const [content, setContent] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { markdown, error } = await sendToBackground({
        name: "getPostData",
        body: {
          transactionId: transactionId
        },
        extensionId: process.env.PLASMO_EXTENSION_ID
      })
      console.log(markdown)
      setLoading(false)
      setContent(markdown)
      setError(error)
    }

    fetchData()
    // console.log(content)
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  // return <ReactMarkdown>{content}</ReactMarkdown>
  return <div>{content}</div>
}

export default ArweaveMarkdownViewer
