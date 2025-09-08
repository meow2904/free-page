"use client"

import { useState, useEffect } from "react"
import Button from "@/components/forms/Button";
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Loader2, Download, ZoomIn, ZoomOut } from "lucide-react"

interface FilePreviewProps {
    file: File ;
}

export function Preview({ file }: FilePreviewProps) {
    const [content, setContent] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const [scale, setScale] = useState(1)

    useEffect(() => {
        const loadFile = async () => {
            setLoading(true)
            setError("")

            try {
                if (file && file.type === "application/pdf") {
                    await loadPDF(file)
                } else if (file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    await loadDOCX(file)
                }
            } catch (err) {
                setError("Failed to load file: " + (err as Error).message)
            } finally {
                setLoading(false)
            }
        }

        loadFile()
    }, [file])

    const loadPDF = async (file: File) => {
        // For PDF preview, we'll use an iframe with the blob URL
        const url = URL.createObjectURL(file)
        setContent(url)
    }

    const loadDOCX = async (file: File) => {
        // For DOCX, we'll use mammoth.js to convert to HTML
        const mammoth = await import("mammoth")
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.convertToHtml({ arrayBuffer })
        setContent(result.value)
    }

    const downloadFile = () => {
        const url = URL.createObjectURL(file)
        const a = document.createElement("a")
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                {/*<Loader2 className="h-8 w-8 animate-spin" />*/}
                <span className="ml-2">Loading file...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error}</p>
                    {/*<Button onClick={() => window.location.reload()}>Try Again</Button>*/}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/*<div className="flex items-center justify-between">*/}
            {/*    <div className="flex items-center gap-2">*/}
            {/*        <Button*/}
            {/*            variant="outline"*/}
            {/*            size="sm"*/}
            {/*            onClick={() => setScale(Math.max(0.5, scale - 0.1))}*/}
            {/*            disabled={file.type !== "application/pdf"}*/}
            {/*        >*/}
            {/*            <ZoomOut className="h-4 w-4" />*/}
            {/*        </Button>*/}
            {/*        <span className="text-sm text-muted-foreground">{Math.round(scale * 100)}%</span>*/}
            {/*        <Button*/}
            {/*            variant="outline"*/}
            {/*            size="sm"*/}
            {/*            onClick={() => setScale(Math.min(2, scale + 0.1))}*/}
            {/*            disabled={file.type !== "application/pdf"}*/}
            {/*        >*/}
            {/*            <ZoomIn className="h-4 w-4" />*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*    <Button onClick={downloadFile} variant="outline" size="sm">*/}
            {/*        <Download className="h-4 w-4 mr-2" />*/}
            {/*        Download*/}
            {/*    </Button>*/}
            {/*</div>*/}

            <div className="p-4">
                {file && file.type === "application/pdf" ? (
                    <iframe
                        src={content}
                        className="w-full h-96 border-0"
                        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
                        title="PDF Preview"
                    />
                ) : (
                    <div
                        className=" h-[500] border-1 border-gray-200 rounded-xl prose prose-sm max-w-none overflow-auto"
                        dangerouslySetInnerHTML={{ __html: content }}
                        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
                    />
                )}
            </div>
        </div>
    )
}
