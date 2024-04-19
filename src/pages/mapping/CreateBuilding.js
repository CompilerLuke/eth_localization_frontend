import { FormItem, SubmitButton, submitForm } from "../../components/Form"
import { Formik, Form } from "formik"

export default function CreateBuilding({ flow, setFlow, setComplete }) {
    let validate = (values) => {
        let errors = {};
        if(values.name == "") errors.name = "Required";
        else if (!/[A-Za-z0-9\.]+/.test(values.name)) errors.fileName = "Alpha-number and . suported"
        return errors;
    };

    let content = (ctx) => {
        return <Form>
            <FormItem ctx={ctx} name="name" label="Building Name"/>
            <SubmitButton ctx={ctx}/>
        </Form>
    };

    async function onResponse(response) {
        let data = await response.json();
        console.log("Server response", data);
        if('id' in data) {
            console.log("Setting building_id: ", data.id);
            console.log(data, flow);
            setComplete(true)
            setFlow({...flow, building_id: data.id });
        }
    };

    return <div>
        <Formik initialValues={{ name: "" }}
        onSubmit={submitForm("mapping/new_building", onResponse)}
        validate={validate}>
            {content}
        </Formik>
    </div>
}