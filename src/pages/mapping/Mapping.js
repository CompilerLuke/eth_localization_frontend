import AnnotateFloorplan from "./annotation/AnnotateFloorplan"
import ScanUpload from "./ScanUpload"
import { StepGuide, StepItem } from "./StepGuide"
import { RequireAuth } from "../../auth/Context"
import CreateBuilding from "./CreateBuilding"
import { useState } from "react"


export default function Mapping() {
    let [flow, setFlow] = useState({})

    return <RequireAuth> 
        <div>
            <h1>Mapping Page</h1>
            <StepGuide>
                <StepItem name="Create Building" content={({setComplete}) => {
                    return <CreateBuilding flow={flow} setFlow={setFlow} setComplete={setComplete}/>
                }}/>
                <StepItem name="Upload scan" content={({setComplete}) => {
                    return <ScanUpload flow={flow} setFlow={setFlow} setComplete={setComplete}/>
                }}/>
                <StepItem name="Annotate Floorplan" content={({setComplete}) => {
                    <AnnotateFloorplan flow={flow} setFlow={setFlow} setComplete={setComplete}/>
                }}/>
            </StepGuide>
        </div>
    </RequireAuth> 
}