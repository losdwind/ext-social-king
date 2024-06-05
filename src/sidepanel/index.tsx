import "~style.css"

import { MemoryRouter, Route, Routes } from "react-router-dom"

import { Storage } from "@plasmohq/storage"

import { Detail } from "./detail"
import { HomeTab } from "./home"
import Wallet from "./wallet"
import { useEffect } from "react"

export const storage = new Storage()
function IndexSidePanel() {
  useEffect(() => {
    loadTwitterScript() // Load the Twitter script when the component mounts
  }, [])
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomeTab />} />
        <Route path="/detail/:url" element={<Detail />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </MemoryRouter>
  )
}

export default IndexSidePanel

function loadTwitterScript() {
  if (window.twttr) {
    console.log("Twitter script already loaded.")
    return // Twitter script is already loaded
  }

  window.twttr = (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {}
    if (d.getElementById(id)) return t // This prevents loading the script multiple times
    js = d.createElement(s)
    js.id = id
    js.src = "../core/widgets.js"
    fjs.parentNode.insertBefore(js, fjs)

    t._e = []
    t.ready = function (f) {
      t._e.push(f)
    }

    return t
  })(document, "script", "twitter-wjs")
}
