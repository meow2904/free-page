"use client"

import {useEffect, useRef, useState} from "react";

interface SelectProps {
    required?: boolean;
    error?: string;
    id?: string;
    className?: string;
    tabIndex?: number;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options?: { value: string; name: string }[];
    value?: string;
}
const Select: React.FC<SelectProps> = ({
                                                             id,
                                                             className,
                                                             required,
                                                             tabIndex,
                                                             onChange,
                                                             options,
                                                             error,
                                                             value,
                                                         }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState(value || "")
    const [selectedLabel, setSelectedLabel] = useState("")
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Find selected option label
    useEffect(() => {
        const selected = options?.find((option) => option.value === selectedValue)
        setSelectedLabel(selected ? selected.name : "")
    }, [selectedValue, options])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (optionValue: string, optionName: string) => {

        setSelectedValue(optionValue)
        setSelectedLabel(optionName)
        setIsOpen(false)

        // Create synthetic event for onChange
        const syntheticEvent = {
            target: {
                value: optionValue,
                id: optionName,
            },
        } as React.ChangeEvent<HTMLSelectElement>
        onChange(syntheticEvent)
    }

    return (
        <div className="text-left">
            <div className="w-full px-2 pb-0 pt-4">
                <div ref={dropdownRef} className="relative">
                    {/* Custom select trigger */}
                    <button
                        type="button"
                        id={id}
                        className={`peer w-full border border-gray-300 rounded-lg p-2 text-sm 
                       focus:outline-none focus:border-blue-500
                       transition-all duration-300 ease-out
                       bg-white/80 backdrop-blur-xl hover:shadow-xl
                       text-gray-700 font-medium text-left flex items-center justify-between ${className}`}
                        tabIndex={tabIndex}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                    <span className={selectedValue ? "text-gray-700" : "text-gray-400"}>
                      {selectedLabel || "Chọn một tùy chọn..."}
                    </span>
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Custom dropdown options */}
                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                            <div className="p-2 max-h-60 overflow-y-auto">
                                {options && options.length === 0 ? (
                                    <div className="px-4 py-3 text-gray-400 italic text-sm rounded-xl">Không có dữ liệu</div>
                                ) : (
                                    <>
                                        {!required && (
                                            <button
                                                type="button"
                                                className="w-full text-left px-4 py-3 text-gray-500 text-sm rounded-xl
                                 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50
                                 transition-all duration-200 ease-out hover:scale-[1.02]
                                 focus:outline-none focus:bg-blue-50 focus:text-blue-600"
                                                onClick={() => handleSelect("", "")}
                                            >
                                                Chọn một tùy chọn...
                                            </button>
                                        )}
                                        {options?.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                className="w-full text-left px-4 py-3 text-gray-700 text-sm rounded-xl
                                 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/50
                                 hover:text-blue-600 transition-all duration-200 ease-out
                                 hover:scale-[1.02] hover:shadow-sm
                                 focus:outline-none focus:bg-blue-100 focus:text-blue-700
                                 active:scale-[0.98]"
                                                onClick={() => handleSelect(option.value, option.name)}
                                            >
                                                {option.name}
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Hidden select for form compatibility */}
                <select
                    value={selectedValue}
                    onChange={() => {}} // Handled by custom dropdown
                    required={required}
                    className="sr-only"
                    tabIndex={-1}
                >
                    <option value="">Chọn một tùy chọn...</option>
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <p className="px-2 py-1 text-red-500 text-xs font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {error}
                </p>
            )}
        </div>
    )
}

export default Select;