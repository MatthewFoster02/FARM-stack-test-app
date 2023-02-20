import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"


const Layout = ({children}) => {
    return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 min-h-full flex flex-col align-middle justify-center items-center">
                    <Outlet />
                </main>
                <div className="flex-1 min-h-full flex flex-col align-middle justify-center">{children}</div>
                <Footer />
            </div>
    )
}

export default Layout
