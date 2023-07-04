import {ProgressIndicator, ProgressStep} from "react-rainbow-components";
import React from "react";
import Row from "react-bootstrap/Row";

const stepNames = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'];

const StepsComponent = ({step}) => {
    return (
        <Row>
            <ProgressIndicator currentStepName={stepNames[step - 1]}>
                <ProgressStep name="step-1" label="Filmy"/>
                <ProgressStep name="step-2" label="Lokalizacje"/>
                <ProgressStep name="step-3" label="Sekcje"/>
                <ProgressStep name="step-4" label="Dni"/>
                <ProgressStep name="step-5" label="Wyniki"/>
            </ProgressIndicator>
        </Row>

    )
}
export default StepsComponent;