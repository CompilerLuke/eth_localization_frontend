import {useState} from 'react';
import { FormItem, submitForm, SubmitButton } from '../../components/Form.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export default function ScanUpload({flow, setFlow, setComplete}) {
    let metadata = "";
    let fileType = "polycam/raw";

    let validate = (fields) => {
        const errors = {};
        if(fields.fileName == "") errors.fileName = 'required';
        else if (!/[A-Za-z0-9\.]+/.test(fields.fileName)) errors.fileName = "Alpha-number and . suported"
        return errors;
    }

    let content = (ctx) => {
        let {setFieldValue} = ctx;
        return (<Form>
            <FormItem ctx={ctx} name="fileName" label="file name"/>
            <FormItem ctx={ctx} name="file" label="" type="file" onChange={(e) => {
                    console.log("On chang!!!!!!!");
                    if (e.currentTarget.files) {
                        alert(e.currentTarget.files[0].size);
                        setFieldValue("file", e.currentTarget.files[0]);
                    }
                }}/>
            <SubmitButton ctx={ctx}/>
        </Form>)
    };

    async function onResponse(resp) {
        if(resp.ok) {
            setComplete(true);
        }
    };

    return <div>
        <Formik initialValues={{ fileName: '', file: undefined, fileType: "polycam/raw", metadata: "", building: flow.building_id }}
        onSubmit={submitForm("mapping/file_server/upload",onResponse)}
        validate={validate}>
            {content}
        </Formik>
    </div>
}