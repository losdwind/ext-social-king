import { CopyButton } from "@/components/CopyButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
  stringToHex,
  toHex,
  type Chain,
  type PrivateKeyAccount
} from "viem"
import {
  generatePrivateKey,
  privateKeyToAccount,
  privateKeyToAddress
} from "viem/accounts"
import { polygon, polygonAmoy } from "viem/chains"

import { useStorage } from "@plasmohq/storage/hook"

import { chainlinkAbi } from "~core/chainlinkAbi"
import { socialKingAbi } from "~core/socialKingAbi"

const onClickBind = async (username: string, account: PrivateKeyAccount) => {
  console.log("account", account)

  const walletClient = createWalletClient({
    account,
    chain: polygonAmoy as Chain,
    transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
  })
  console.log("account", account)
  await walletClient.writeContract({
    address: process.env.PLASMO_PUBLIC_CHAINLINK_CONTRACT_ADDRESS,
    abi: chainlinkAbi,
    functionName: "sendRequest",
    args: [2926n, [username, account.address]]
  })
  console.log("succeed")
}

const onClickClaim = async (account: PrivateKeyAccount) => {
  console.log("account", account)

  const walletClient = createWalletClient({
    account,
    chain: polygonAmoy as Chain,
    transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
  })
  console.log("account", account)
  await walletClient.writeContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "claim"
  })
  console.log("succeed claim")
}

const onClickAuthorClaim = async (account: PrivateKeyAccount) => {
  console.log("account", account)

  const walletClient = createWalletClient({
    account,
    chain: polygonAmoy as Chain,
    transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
  })
  console.log("account", account)
  await walletClient.writeContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "authorClaim"
  })
  console.log("succeed claim")
}

const publicClient = createPublicClient({
  chain: polygonAmoy as Chain,
  transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
})

const getBalance = async (address:`0x${string}`) => {
  const maticBalance = await publicClient.getBalance({ address })
  return formatEther(maticBalance)
}

const getUserBalance = async () => {
  const buyPrice = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "getUserBalance",
    args: []
  })
  return formatEther(buyPrice)
}

const getAuthorBalance = async () => {
  const buyPrice = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "getAuthorBalance",
    args: []
  })
  return formatEther(buyPrice)
}

// Token ABI for fetching balances (simplified and generic for ERC20 tokens)
const tokenAbi = [
  {
    constant: true,
    inputs: [],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
]

export default function wallet() {
  const [username, setUsername] = useState<string>()
  const [isShowingPrivateKey, setIsShowingPrivateKey] = useState(false)
  const [privateKey] = useStorage("pk")

  const [chain, setChain] = useState(polygonAmoy)
  const [balances, setBalances] = useState("0")
  const [userBalances, setUserBalances] = useState("0")
  const [authorBalances, setAuthorBalances] = useState("0")

  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1)
  }
  useEffect(() => {
    fetchBalances()
  }, [privateKey, chain])

  const publicClient = createPublicClient({
    chain,
    transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
  })

  const fetchBalances = async () => {
    const address = privateKeyToAddress(privateKey)
    const balance = await getBalance(address)
    setBalances(parseFloat(balance).toFixed(4))
    const userBalance = await getUserBalance()
    setUserBalances(parseFloat(userBalance).toFixed(4))
    const authorBalance = await getAuthorBalance()
    setAuthorBalances(parseFloat(authorBalance).toFixed(4))
  }

  return (
    <div className="flex flex-col gap-2 p-4 ">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button onClick={handleBackClick} variant="ghost" size="sm">
                <ArrowLeftIcon />
              </Button>
              <WalletIcon className="h-6 w-6" />
              <CardTitle>My Wallet</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <BitcoinIcon className="h-4 w-4 mr-2" />
                  Polygon Amoy
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BitcoinIcon className="h-4 w-4 mr-2" />
                  Ethereum
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SunIcon className="h-4 w-4 mr-2" />
                  Avalanche
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Wallet Address
              </p>
              <p className="font-mono text-sm">
                {privateKey ? privateKeyToAddress(privateKey) : ""}
              </p>
            </div>
            <CopyButton
              value={privateKey ? privateKeyToAddress(privateKey) : ""}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current Balance
              </p>
              <p className="font-mono text-2xl font-bold">{balances} Matic</p>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchBalances}>
              <RefreshCwIcon className="h-4 w-4" />
              <span className="sr-only">Refresh balance</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1">
              <ArrowUpIcon className="h-4 w-4 mr-2" />
              Send
            </Button>
            <Button className="flex-1">
              <ArrowDownIcon className="h-4 w-4 mr-2" />
              Receive
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => onClickClaim(privateKeyToAccount(privateKey))}>
              {" "}
              Claim: {userBalances} Matic
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={() =>
                onClickBind(username, privateKeyToAccount(privateKey))
              }>
              Bind Social Account
            </Button>
            <Input
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              value={username}
              placeholder="@socialking"
            />
            <Button
              onClick={() =>
                onClickAuthorClaim(privateKeyToAccount(privateKey))
              }>
              {" "}
              Author Claim: {authorBalances} Matic
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ArrowDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  )
}

function ArrowUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  )
}

function BitcoinIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
    </svg>
  )
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function CopyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function RefreshCwIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}

function SunIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function WalletIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}
