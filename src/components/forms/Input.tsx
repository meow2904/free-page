import {FaRegEye, FaRegEyeSlash} from "react-icons/fa";
import {useState} from "react";

interface InputProps {
    type?: "text" | "password" | "select" | "textarea";
    placeholder?: string;
    required?: boolean;
    error?: string;
    name?: string;
    title?: string;
    id?: string;
    className?: string;
    tabIndex?: number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    value?: string;
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
                                         onChange,
                                         value,

                                     }) => {

    const [showPassword, setShowPassword] = useState<Boolean>(false);

    return (
        <div className="text-left">
            {
                type === "textarea" ? (
                        <div className="w-full px-2 pb-0 pt-4">
                            <textarea
                                id={id}
                                placeholder={placeholder}
                                className={`peer w-full min-h-[100px] border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 backdrop-blur-xl focus:shadow-xl  hover:shadow-xl ${className}`}
                                required={required}
                                tabIndex={tabIndex}
                                onChange={onChange}
                                value={value}
                            >
                            </textarea>
                        </div>
                    ) :
                    (
                        <div className="relative w-full px-2 pb-0 pt-4">
                            <input
                                id={id}
                                className={`peer w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 backdrop-blur-xl focus:shadow-xl hover:shadow-xl ${className}`}
                                type={type === "password" && showPassword ? "text" : type}
                                placeholder={placeholder}
                                autoComplete={value}
                                required={required}
                                tabIndex={tabIndex}
                                onChange={onChange}
                                value={value}
                            />
                            {
                                type === "password" && (
                                    <button
                                        type="button"
                                        className="absolute inset-y-2/3 right-4 flex items-center text-gray-500 cursor-pointer"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? <FaRegEyeSlash size={16}/> : <FaRegEye size={16}/>}
                                    </button>
                                )}
                        </div>
                    )
            }
            {error &&
                (
                    <p className="px-2 py-1 text-red-500 text-xs font-medium flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {error}
                    </p>
                )}
        </div>
    )
}

export default Input;