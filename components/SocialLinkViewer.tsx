import { encode } from "punycode"
import React from "react"
import { XEmbed } from "react-social-media-embed"

// Helper function to convert hex to string
export function hexToString(hex) {
  let str = ""
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16))
  }
  return str
}

export function extractUsername(url) {
  const match = url.match(/twitter\.com\/([^\/]+)/)
  return match ? match[1] : null
}

const SocialLinkViewer = ({ hexString }) => {
  // Convert hex string to URL
  const url = hexToString(hexString)
  const encodedUrl = encodeURIComponent(url);

  // Iframe src URL using TwitFrame to avoid Twitter's X-Frame-Options: DENY
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

export default SocialLinkViewer
