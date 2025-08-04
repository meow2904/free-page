import {ReactNode} from "react";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

const HeaderLayout = ({ children }: {children: ReactNode}) => {
    return (
        <div className="font-medium w-screen min-h-screen flex flex-col">
            <Header/>
            <main className="flex-1 min-h-screen">
                {children}
            </main>
            <Footer/>
        </div>
    )
}
export default HeaderLayout;