"use client";

import Input from "@/components/forms/Input";
import Form from "@/components/forms/Form";
import Button from "@/components/forms/Button";
import Select from "@/components/forms/Select";
import {useState} from "react";
import {useTranslations} from "next-intl";
import {FilePreview, Preview} from "@/components/ui/preview";

interface FormInputProps {
    input1: string;
    input2: string;
    selectValue: string;
}

const tempSelect = [
    { name: "Select 1", value: "1" },
    { name: "Select 2", value: "2" },
    { name: "Select 3", value: "3" },
    { name: "Select 4", value: "4" },
    { name: "Select 5", value: "5" },
    { name: "Select 6", value: "6" },
    { name: "Select 7", value: "7" },
    { name: "Select 8", value: "8" },
]

const TestPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File>()
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if ( file && (file.type === "application/pdf"
            || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        ) {
            setSelectedFile(file)
        } else {
            alert("Please select a PDF or DOCX file")
        }
    }

    const t = useTranslations();
    const [formData, setFormData] = useState<FormInputProps>({
        input1: "",
        input2: "",
        selectValue: "",

    });
    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let tempErrors: any = {};
        if (!formData.input1) tempErrors.input1 = t('fullname');
        if (!formData.input2) tempErrors.input2 = t('password');
        if (!formData.input2) tempErrors.selectValue = t('selectValue');
        setErrors(tempErrors);

        if (Object.keys(tempErrors).length === 0) {
            console.log("Form data:", formData);

            alert(`data: \n
              ${formData.input1} \n
              ${formData.input2} \n
              ${formData.selectValue}`);
            // Handle the submission to the backend
        }
    }

    return (
        <div className="w-2/3 border rounded-lg p-2 ">
            {/*<Form onSubmit={handleSubmit}>*/}
            {/*    <Input*/}
            {/*        id={"input1"}*/}
            {/*        name="Test Input"*/}
            {/*        required={false}*/}
            {/*        type="text"*/}
            {/*        placeholder={"Test Input"}*/}
            {/*        title={"Test Input"}*/}
            {/*        tabIndex={1}*/}
            {/*        error={errors.input1}*/}
            {/*        value={formData.input1}*/}
            {/*        onChange={handleChange}*/}
            {/*    ></Input>*/}
            {/*    <Input*/}
            {/*        id={"input2"}*/}
            {/*        name="Test Textarea"*/}
            {/*        required={false}*/}
            {/*        type="textarea"*/}
            {/*        placeholder={"Test textarea"}*/}
            {/*        title={"textarea"}*/}
            {/*        tabIndex={2}*/}
            {/*        error={errors.input2}*/}
            {/*        value={formData.input2}*/}
            {/*        onChange={handleChange}*/}

            {/*    ></Input>*/}
            {/*    <Select*/}
            {/*        options={tempSelect}*/}
            {/*        onChange={handleChange}*/}
            {/*        tabIndex={3}*/}
            {/*        id={"selectBox"}*/}
            {/*        error={errors.selectValue}*/}
            {/*    >*/}

            {/*    </Select>*/}
            {/*    <Button*/}
            {/*        type="submit"*/}
            {/*        className={"bg-green-400 p-1 text-black"}*/}
            {/*        tabIndex={3}*/}
            {/*    >*/}
            {/*        Submit*/}
            {/*    </Button>*/}
            {/*</Form>*/}

            <Form >
                <input type="file" accept=".pdf,.docx" onChange={handleFileSelect} className="" id="file-input" />
                <Preview file={selectedFile}></Preview>
            </Form>


        </div>
    )
}

export default TestPage;