import {FaRegEye, FaRegEyeSlash} from "react-icons/fa";
import {useState} from "react";

interface InputProps {
    type?: "text" | "password" | "select" | "textarea";
    placeholder?: string;
    required?: boolean;
    error?: boolean;
    name?: string;
    title?: string;
    id?: string;
    className?: string;
    tabIndex?: number;
}

const Input: React.FC<InputProps> = ({
                                         placeholder,
                                         error,
                                         type,
                                         required,
                                         name,
                                         title,
                                         id,
                                         className,
                                         tabIndex,

                                     }) => {

    const [showPassword, setShowPassword] = useState<Boolean>(false);

    return (
        <>
            {
                type === "textarea" ? (
                        <div className="w-full p-2">
                            <textarea
                                placeholder={placeholder}
                                className={`peer w-full min-h-[100px] border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 backdrop-blur-xl ${className}`}
                                required={required}
                                tabIndex={tabIndex}
                            >
                            </textarea>
                        </div>
                    ) :
                    (
                        <div className="relative w-full p-2">
                            <input
                                id={id}
                                className={`peer w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 backdrop-blur-xl ${className}`}
                                type={type === "password" && showPassword ? "text" : type}
                                placeholder={placeholder}
                                required={required}
                                tabIndex={tabIndex}

                            />
                            {
                                type === "password" && (
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-4 flex items-center text-gray-500 cursor-pointer"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? <FaRegEyeSlash size={16}/> : <FaRegEye size={16}/>}
                                    </button>
                                )}
                        </div>
                    )
            }
            <></>
        </>
    )
}

export default Input;