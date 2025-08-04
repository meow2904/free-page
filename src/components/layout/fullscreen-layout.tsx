"use client"
import React, {ReactNode} from "react";
import {IoMdArrowBack} from "react-icons/io";
import { useRouter } from 'next/navigation';

const FullscreenLayout = ({ children }: {children: ReactNode}) => {
    const router = useRouter();

    return (
        <div className="w-screen h-screen  text-white relative font-medium">
            <main className="flex-1 min-h-screen">
                {children}
            </main>

            <div className="absolute text-white left-5 top-5 cursor-pointer text-2xl"
                 onClick={() => router.back()}
            >
                <IoMdArrowBack className="w-[20px] h-[20px] sm:w-[25px] sm:h-[25px]"/>
            </div>
        </div>

    )
}
export default FullscreenLayout;