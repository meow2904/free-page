"use client"

import * as React from "react"
import {CiFileOn} from "react-icons/ci";
import {FiUpload} from "react-icons/fi";
import {IoIosRemove} from "react-icons/io";

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onFileChange?: (files: FileList | null) => void
    maxFiles?: number
    maxSize?: number // in bytes
    acceptedTypes?: string[]
    showPreview?: boolean
    className?: string
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
    (
        {
            onFileChange,
            maxFiles = 1,
            maxSize = 5 * 1024 * 1024, // 5MB default
            acceptedTypes = [],
            showPreview = true,
            className,
            disabled,
            ...props
        },
        ref,
    ) => {
        const [files, setFiles] = React.useState<File[]>([])
        const [dragActive, setDragActive] = React.useState(false)
        const inputRef = React.useRef<HTMLInputElement>(null)

        React.useImperativeHandle(ref, () => inputRef.current!)

        const handleFiles = (fileList: FileList | null) => {
            if (!fileList) return

            const newFiles = Array.from(fileList)

            // Filter files by type if specified
            const validFiles =
                acceptedTypes.length > 0
                    ? newFiles.filter((file) => acceptedTypes.some((type) => file.type.includes(type)))
                    : newFiles

            // Filter files by size
            const sizeValidFiles = validFiles.filter((file) => file.size <= maxSize)

            // Limit number of files
            const finalFiles = maxFiles === 1 ? sizeValidFiles.slice(0, 1) : [...files, ...sizeValidFiles].slice(0, maxFiles)

            setFiles(finalFiles)

            // Create FileList-like object for callback
            const dt = new DataTransfer()
            finalFiles.forEach((file) => dt.items.add(file))
            onFileChange?.(dt.files)
        }

        const removeFile = (index: number) => {
            const newFiles = files.filter((_, i) => i !== index)
            setFiles(newFiles)

            const dt = new DataTransfer()
            newFiles.forEach((file) => dt.items.add(file))
            onFileChange?.(dt.files)
        }

        const handleDrag = (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (e.type === "dragenter" || e.type === "dragover") {
                setDragActive(true)
            } else if (e.type === "dragleave") {
                setDragActive(false)
            }
        }

        const handleDrop = (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)

            if (disabled) return
            handleFiles(e.dataTransfer.files)
        }

        const formatFileSize = (bytes: number) => {
            if (bytes === 0) return "0 Bytes"
            const k = 1024
            const sizes = ["Bytes", "KB", "MB", "GB"]
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
        }

        return (
            <div className={`w-full ${className}`}>
                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-colors
                        ${dragActive ? "border-primary bg-primary/5" : "border-border"} 
                        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"} ` }
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !disabled && inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        multiple={maxFiles > 1}
                        accept={acceptedTypes.join(",")}
                        onChange={(e) => handleFiles(e.target.files)}
                        disabled={disabled}
                        {...props}
                    />

                    <div className="flex flex-col items-center justify-center text-center">
                        <FiUpload className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-sm font-medium mb-1">{dragActive ? "Thả file vào đây" : "Chọn file hoặc kéo thả"}</p>
                        <p className="text-xs text-muted-foreground">
                            {acceptedTypes.length > 0 && `Chấp nhận: ${acceptedTypes.join(", ")} • `}
                            Tối đa {formatFileSize(maxSize)}
                            {maxFiles > 1 && ` • Tối đa ${maxFiles} file`}
                        </p>
                    </div>
                </div>

                {/* File Preview */}
                {showPreview && files.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg bg-gray-100">
                                <div className="flex-1 flex items-center space-x-3">
                                    <CiFileOn  className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1 min-w-0 text-start">
                                        <p className="text-sm font-semibold truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <button
                                    className={"hover:cursor-pointer"}
                                    onClick={(e: any) => {
                                        e.stopPropagation()
                                        removeFile(index)
                                    }}
                                    disabled={disabled}
                                >
                                    <IoIosRemove className="h-4 w-4"/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    },
)

FileInput.displayName = "FileInput"

export { FileInput }
