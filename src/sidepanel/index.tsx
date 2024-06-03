import "~style.css"

import { MemoryRouter, Route, Routes } from "react-router-dom"

import { Storage } from "@plasmohq/storage"

import { Detail } from "./detail"
import { HomeTab } from "./home"
import Wallet from "./wallet"

export const storage = new Storage()

function IndexSidePanel() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomeTab />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </MemoryRouter>
  )
}

export default IndexSidePanel
