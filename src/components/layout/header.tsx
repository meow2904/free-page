"use client"
import Link from "next/link";
import {usePathname} from "next/navigation";
import { Drawer } from "vaul";
import {CiMenuBurger} from "react-icons/ci";
import React from "react";

const links = [
    {
        title: "Overview",
        href: "/",
    },
    {
        title: "Universe",
        href: "/galaxy",
    },
    {
        title: "Projects",
        href: "/projects",
    }
]

const HeaderLink = ({title, href}: { title: string; href: string }) => {
    const pathname = usePathname()
    const isActive = href === pathname
    return (
        <>
            <div className={
                `flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${isActive ?
                    "dark:bg-white dark:text-black bg-zinc-900 text-white" : "dark:hover:bg-zinc-800 hover:bg-zinc-100"} `}>
                <Link href={href}>{title}</Link>
            </div>
        </>

    )
}


const Header: React.FC = () => {
    const pathname = usePathname()
    return (
        <>
            <header className="top-0 md:top-8 z-50 md:sticky">
                <div className="mx-auto flex justify-between gap-10 items-center transition-all duration-300 p-2 z-50 bg-transparent backdrop-blur-md w-full md:w-[80%] shadow md:rounded-3xl ">
                    <div className="flex-1 items-center gap-3 justify-center hidden sm:flex">
                        {links.map((link) => (
                            <HeaderLink
                                key={link.title}
                                title={link.title}
                                href={link.href}
                            />
                        ))}
                    </div>
                    <Drawer.Root>
                        <Drawer.Trigger>
                            <div className="rounded-xl p-2 shadow sm:hidden">
                                <CiMenuBurger/>
                            </div>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                            <Drawer.Overlay className="fixed inset-0 bg-black/60" />
                            <Drawer.Content className="h-1/3 bg-gray-100 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 outline-none">
                                <div className=" p-4 bg-white rounded-t-[10px] flex-1">
                                    <div aria-hidden className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                                    <div className="max-w-md mx-auto">
                                        <Drawer.Title className="text-center font-medium mb-4 text-gray-900">
                                            <span className="">huynd.dev.vn</span>
                                        </Drawer.Title>
                                        <div className="flex flex-col items-start gap-2 font-medium text-xl px-2">
                                            {links.map((link) => (
                                                <Link
                                                    key={link.title}
                                                    title={link.title}
                                                    href={link.href}

                                                >
                                                    {link.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Drawer.Content>
                        </Drawer.Portal>
                    </Drawer.Root>
                </div>
            </header>
        </>
    )
}
export default Header;
