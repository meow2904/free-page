"use client"
import {ReactNode} from "react";
import FullscreenLayout from "@/components/layout/fullscreen-layout";
import HeaderLayout from "@/components/layout/header-layout";
import {usePathname} from "next/navigation";

const MainLayout = ({ children }: {children: ReactNode}) => {
    const pathname = usePathname();
    const isFullscreen = pathname.startsWith("/galaxy");
    return (
            isFullscreen ?
                (
                    <FullscreenLayout>{children}</FullscreenLayout>
                )
                :
                (
                    <HeaderLayout>{children}</HeaderLayout>
                )
    )
}
export default MainLayout;