import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import "~style.css"
import { LoginButton } from "../contents/login"
import {MemoryRouter} from "react-router-dom"
import { Route, Routes } from "react-router-dom"
import { Detail } from "./postDetail"
import { HomeTab } from "./home"
import { createClient, Provider, useQuery, cacheExchange, fetchExchange } from 'urql';
  


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
