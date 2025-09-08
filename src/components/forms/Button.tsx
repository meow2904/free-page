import React from "react";


interface ButtonProps {
    disabled?: boolean;
    className?: string;
    type?: any;
    children?: React.ReactNode;
    tabIndex?: number;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = (
    {
        className,
        children,
        disabled,
        type,
        tabIndex,
        onClick,
    }
) => {
    return (
        <div className='w-full flex items-end justify-end p-2'>
            <button
                className={`rounded-xl w-[100px] hover:cursor-pointer hover:shadow-xl  focus:outline-none focus:shadow-[0_0_0_3px_rgba(16,185,129,0.4)] ${className}`}
                disabled={disabled}
                type={type}
                tabIndex={tabIndex}
                onClick={onClick}
            >
                {children}
            </button>
        </div>
    )
}

export default Button;