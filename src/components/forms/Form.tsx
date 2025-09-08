import React, {FormEvent} from "react";
interface FormProps {
    className?: string;
    children?: React.ReactNode;
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}
const Form: React.FC<FormProps> = ({
                                       className,
                                       onSubmit,
                                       children,
                                   }) => {
    return (
        <form className="w-full bg-gray-100/30 shadow backdrop-blur-md p-5 rounded-xl" onSubmit={onSubmit}>
            {children}
        </form>
    )
}

export default Form;