"use client"

import {useState, useEffect, useRef} from "react"
import {renderAsync} from "docx-preview";
import {log} from "node:util";

interface FilePreviewProps {
    file: File | undefined;
    className?: string;
}

export function Preview({ file, className }: FilePreviewProps) {
    const [content, setContent] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const [scale, setScale] = useState(1)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadFile = async () => {
            setLoading(true)
            setError("")
            try {
                if (file && file.type === "application/pdf") {
                    await loadPDF(file)
                }
                else if (file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    await loadDocx(file);
                }
            } catch (err) {
                setError("Failed to load file: " + (err as Error).message)
            } finally {
                setLoading(false)
            }
        }
        loadFile().then(r => console.log('Rendered file'))
    }, [file])

    const loadPDF = async (file: File) => {
        // For PDF preview, we'll use an iframe with the blob URL
        const url = URL.createObjectURL(file)
        setContent(url)
    }
    const loadDocx = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            try {
                if (containerRef.current) {
                    containerRef.current.innerHTML = "";
                    await renderAsync(arrayBuffer, containerRef.current, undefined, {
                        className: "docx", // class mặc định để style
                        inWrapper: true,
                        ignoreWidth: false,
                        ignoreHeight: false,
                        ignoreFonts: false,
                        breakPages: true,
                        hideWrapperOnPrint: true,
                        trimXmlDeclaration: true,
                        ignoreLastRenderedPageBreak: true,
                        renderHeaders: true,
                        renderFooters: true,
                        renderAltChunks: true,
                    });
                }
            } catch (err) {
                console.error(err);
                setError("Không thể hiển thị file DOCX.");
            }
        };
        reader.readAsArrayBuffer(file);
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
                </div>
            </div>
        )
    }

    if (!file) {
        return (
            <div className={`preview h-[300] border-1 p-4 border-gray-300 rounded-xl ${className}`}>
                <div className="docx-preview bg-white p-4 w-full h-full"
                ></div>
            </div>
        )
    }

    return (
        <div className={`preview h-[300] border-1 border-gray-300 rounded-xl ${className}`}>
            <div className="p-4 w-full h-full">
                {content.length && file.type === "application/pdf" ? (
                    <iframe
                        src={content}
                        className="w-full h-full border-0"
                        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
                        title="PDF Preview"
                    />
                ) : (
                    <div
                        ref={containerRef}
                        className="docx-preview bg-white w-full h-full !text-start overflow-auto"
                    ></div>
                )}
            </div>
        </div>
    )
}
