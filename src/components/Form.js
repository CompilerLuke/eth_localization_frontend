export function submitForm(url, then) {
    let onSubmit = (values, {setSubmitting}) => {
        console.log(`Submitting ${url}`, values);

        const formData = new FormData();
        for(let key in values) {
            console.log(values[key]);
            formData.append(key, values[key]);
        }        
        const fetchOptions = {
            method: "POST",
            body: formData
        };

        fetch(url, fetchOptions).then(then);
    };

    return onSubmit;
}

export function SubmitButton({ctx}) {
    return <button type="submit" disabled={ctx.errors == {}}>
    Submit
    </button>
}

export function FormItem({name, label, ctx, type, onChange}) {
    let handleChange = onChange || ctx.handleChange;

    let input;
    if(type == "file") input =<input name={name} type={type} onChange={handleChange}/>;
    else input = <input name={name} type={type} onChange={handleChange} value={ctx.values[name]}/>

    return <div className="SequentialFormItem">
        <label>{label}</label>
        {input}
        <label>{ctx.errors[name]}</label>
    </div>
}