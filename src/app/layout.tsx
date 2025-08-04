import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";
import {AppProvider} from "@/providers/app-provider";
import FullscreenLayout from "@/components/layout/fullscreen-layout";
import MainLayout from "@/components/layout/main-layout";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "meo meo meo meo",
    description: "meo meo meo meo",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
                <AppProvider>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </AppProvider>
            </body>
        </html>
    );
}
