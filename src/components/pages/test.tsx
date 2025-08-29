"use client";

import Input from "@/components/forms/Input";
import Form from "@/components/forms/Form";

const TestPage: React.FC = () => {
    return (
        <div className="w-2/3 border rounded-lg p-2 ">

            <Form onSubmit={event => event.preventDefault()}>
                <Input

                    id={"1"}
                    name="Test Input"
                    required={true}
                    type="password"
                    placeholder={"hehehehe"}
                    title={"Test Input"}
                    tabIndex={1}
                ></Input>
                <Input
                    id={"2"}
                    name="Test Textarea"
                    required={true}
                    type="textarea"
                    placeholder={"hehehehe"}
                    title={"Test Input"}
                    tabIndex={2}
                ></Input>


            </Form>


        </div>
    )
}

export default TestPage;