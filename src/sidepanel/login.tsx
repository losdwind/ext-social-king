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
          action: "WALLET_INFO"
        })
        console.log("Wallet info:", response)
      } catch (error) {
        console.error("Error fetching wallet info:", error)
      }
    }

    // chrome.runtime.sendMessage({ type: "CONNECT_WALLET" }, (response) => {
    //   if (response.error) {
    //     setError(response.error)
    //     setLoading(false)
    //   } else {
    //     setAccount(response.address)
    //     setLoading(false)
    //   }
    // })
  }

  const sendTransaction = async () => {
    if (!account) {
      connect()
    }

    chrome.runtime.sendMessage(
      { type: "SEND_TRANSACTION", account: account },
      (response) => {
        if (response.error) {
          setError(response.error)
          setLoading(false)
        } else {
          const result = response.data.result
          console.log(result)
          setLoading(false)
        }
      }
    )
  }

  return account ? (
    <AddressDisplay address={account} />
  ) : (
    <Button onClick={connect}>Connect Wallet</Button>
  )
}
