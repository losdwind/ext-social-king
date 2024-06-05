import { encode } from "punycode"
import React, { useEffect, useRef, useState } from "react"
import { XEmbed } from "react-social-media-embed"
import { hexToString } from "viem"

import TwitterTweetEmbed from "./TwitterTweetEmbed"

// Helper function to convert hex to string
// export function hexToString(hex) {
//   console.log("hex", hex)
//   let str = ""
//   for (let i = 0; i < hex.length; i += 2) {
//     str += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16))
//   }
//   console.log("First character ASCII value:", str.charCodeAt(0)); // Log ASCII value of the first character
//   console.log("First character:", JSON.stringify(str[0])); // Log the first character

//   return str.trim()
// }

export function extractUsername(url) {
  const match = url.match(/twitter\.com\/([^\/]+)/)
  return match ? match[1] : null
}
function convertToEmbedUrl(url) {
  // Use a regular expression to replace 'watch?v=' with 'embed/'
  return url.replace(/watch\?v=/, 'embed/');
}

function getTweetIdFromUrl(tweetUrl) {
  // Regular expression to match the numeric ID at the end of a tweet URL
  const regex = /twitter\.com\/(?:#!\/)?\w+\/status(?:es)?\/(\d+)/

  // Execute the regular expression on the URL
  const match = tweetUrl.match(regex)

  // If there's a match, return the first capturing group (the ID), otherwise return null
  return match ? match[1] : null
}

const SocialLinkViewer = ({ hexString }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  // const [scriptLoaded, setScriptLoaded] = useState(false)

  // Convert hex string to URL
  const url = hexToString(hexString)
  // Dynamically load the Twitter widget script
  // useEffect(() => {
  //   if (window.twttr) {
  //     setScriptLoaded(true)
  //     return // If twttr is already defined, no need to load the script again
  //   }

  //   const script = document.createElement("script")
  //   script.src = "../src/core/widgets.js" // Replace with your actual path to twitter-widget.js
  //   script.async = true

  //   script.onload = () => {
  //     if (window.twttr && window.twttr.widgets) {
  //       setScriptLoaded(true);  // Check if window.twttr.widgets is available after loading
  //       console.log("Twitter widget script loaded and window.twttr initialized.");
  //     } else {
  //       console.error("Twitter widget script loaded but window.twttr did not initialize correctly.");
  //     }
  //   };

  //   script.onerror = () => {
  //     console.error("Error loading the Twitter widget script.")
  //   }

  //   document.body.appendChild(script)

  //   // Cleanup function
  //   return () => {
  //     document.body.removeChild(script)
  //   }
  // }, [])
  // // Iframe src URL using TwitFrame to avoid Twitter's X-Frame-Options: DENY
  // const iframeSrc = `https://twitframe.com/show?url=${encodedUrl}`;
  // return (
  //   <iframe
  //     frameBorder="0"
  //     scrolling="no"
  //     height={550}
  //     width={350}
  //     src={iframeSrc}
  //     allowTransparency={true}
  //   ></iframe>
  // )
  // console.log("URL:", `"${url}"`) // This will show the URL including any invisible characters like spaces.
  // console.log(
  //   "is twitter",
  //   url.startsWith("https://x.com/") || url.startsWith("https://twitter.com/")
  // )

  // console.log("is youtube", url.startsWith("https://youtube.com/"))

  // if (
  //   url.startsWith("https://x.com/") ||
  //   url.startsWith("https://twitter.com/")
  // ) {
  //   return <iframe src="sandboxes/twitter.html" ref={iframeRef} />
  // }
  // if (url.startsWith("https://youtube.com/")) {
  //   return <iframe src="sandboxes/youtube.html" ref={iframeRef} />
  // }
  // return <XEmbed url={url} />
  // return <TwitterTweetEmbed tweetId={getTweetIdFromUrl(url)} />
  // return <p>here i am from the sandbox</p>
  // return <iframe src="sandboxes/youtube.html" ref={iframeRef} />
  // return <iframe src="sandboxes/twitter.html" ref={iframeRef} />

    if (
    url.startsWith("https://x.com/") ||
    url.startsWith("https://twitter.com/")
  ) {
    const encodedUrl = encodeURIComponent(url);
    const iframeSrc = `https://twitframe.com/show?url=${encodedUrl}`;
    return (
      <iframe
        frameBorder="0"
        scrolling="no"
        height={550}
        width={350}
        src={iframeSrc}
        allowTransparency={true}
      ></iframe>
    )
  }
  if (url.startsWith("https://youtube.com/")) {
    return <iframe src={convertToEmbedUrl(url)} frameBorder="0"/>
  }
}

export default SocialLinkViewer
