import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import "~style.css"

import { MemoryRouter, Route, Routes } from "react-router-dom"
import {
  cacheExchange,
  createClient,
  fetchExchange,
  Provider,
  useQuery
} from "urql"

import { HomeTab } from "./home"
import { LoginButton } from "./login"
import { Detail } from "./postDetail"

function IndexSidePanel() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomeTab />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </MemoryRouter>
  )
}

export default IndexSidePanel
