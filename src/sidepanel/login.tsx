import { SocketAddress } from "net"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import ReactDOM from "react-dom/client"
import {
  createWalletClient,
  custom,
  parseEther,
  type Address,
  type Chain
} from "viem"
import { goerli, mainnet, optimism } from "viem/chains"

import "viem/window"

import { AddressDisplay } from "@/components/AddressDisplay"

export function LoginButton() {
  const [account, setAccount] = useState<Address>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const connect = async () => {
    const queryOptions = { active: true, currentWindow: true }
    const [tab] = await chrome.tabs.query(queryOptions)
    if (tab.id) {
      try {
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: "account"
        })
        console.log("Wallet info:", response)
      } catch (error) {
        console.error("Error fetching wallet info:", error)
      }
    }
  }

  return account ? (
    <AddressDisplay address={account} />
  ) : (
    <Button onClick={connect}>Connect Wallet</Button>
  )
}
