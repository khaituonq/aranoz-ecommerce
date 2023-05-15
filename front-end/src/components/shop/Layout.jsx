import { useEffect } from "react"
 
import Footer from "./Footer"
import Header from "./Header"

const Layout = ({children, title}) => {

  useEffect(() => {
    document.title = title ? title : "Aranoz"
  },[title])

  return (
    <>
      <Header/>
        <main>{children}</main>
      <Footer/>
    </>
  )
}

export default Layout