import { Component, useState, Children} from 'react'

export function StepItem(props) {
    return <div>{props.children}</div>
}

export function StepGuide(props) {
    let [step, setStep] = useState(0);

    let children = props.children;
    let CurrentStep = children[step];

    let prev = () => {
        if(step>0) setStep(step-1);
    };

    let advance = () => {
        if(step<children.length-1) setStep(step+1);
    }

    console.log(CurrentStep.props);


    let [completed, setCompleted] = useState({})
    let [flowState,setFlowState] = useState({})
    
    let name = CurrentStep.props.name

    let setCurrentComplete = (complete) => {
        let newComplete = {...completed};
        newComplete[CurrentStep.props.name] = complete;
        setCompleted(newComplete)
    }

    return <div>
        <h1>Step {name} {step+1}/{children.length}</h1>
        {CurrentStep.props.content({ setComplete: setCurrentComplete })}
        
        <button onClick={prev}>Prev</button>
        <label>{completed[name] ? "Completed" : "Todo"}</label>
        <button onClick={advance}>Next</button>
    </div>
}  