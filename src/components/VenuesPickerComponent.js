import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Select from "react-select";

import {Subtitle, TitleSmall} from "../selectStyles";
import Row from "react-bootstrap/Row";
import {CheckboxToggle} from "react-rainbow-components";
import {Col} from "react-bootstrap";

function VenuesPickerComponent({initialVenues, initialUndesirableVenues, onFormDataChange}) {
    const [selectedUndiserableVenues, setSelectedUndiserableVenues] = useState([]);
    const [venues, setVenues] = useState([]);
    const [toggleKnhOnly, setToggleKnhOnly] = useState(false);

    useEffect(() => {
        if (initialVenues && initialVenues.length > 0) {
            setVenues(initialVenues); // Extract the movies array from initialMovies
        }
        if (initialUndesirableVenues && initialUndesirableVenues.length > 0) {
            setSelectedUndiserableVenues(initialUndesirableVenues);
        }
    }, []);

    useEffect(() => {
        const leftVenues = initialVenues.filter(v => !selectedUndiserableVenues.includes(v));
        setVenues(leftVenues);
    }, [selectedUndiserableVenues]);


    useEffect(() => {
        setVenues(initialVenues);
    }, [initialVenues]);

    const handleChange = (event) => {
        const {name, value} = event.target;
        onFormDataChange(name, value);
    };

    const handleUndisirableVenuesChange = (selectedOptions) => {
        setSelectedUndiserableVenues(selectedOptions);
        handleChange({target: {name: "undesirableVenues", value: selectedOptions}});
    };

    const handleKnhOnlyOnChange = () => {
        setToggleKnhOnly(!toggleKnhOnly);
    }

    // useEffect(() => {
    //     let leftVenues;
    //     if (toggleKnhOnly) {
    //         setSelectedUndiserableVenues(initialVenues.filter(v => selectedUndiserableVenues.includes(v) || !v.value.startsWith("knh")));
    //         // leftVenues = initialVenues.filter(v => !selectedUndiserableVenues.includes(v) && !v.value.startsWith("knh"));
    //     } else {
    //         setSelectedUndiserableVenues(initialVenues.filter(v => selectedUndiserableVenues.includes(v) || v.value.startsWith("knh")));
    //
    //         // leftVenues = initialVenues.filter(v => !selectedUndiserableVenues.includes(v));
    //     }
    //     // setVenues(leftVenues)
    // }, [toggleKnhOnly]);


    return (
        <Container>
            <Row>
                <TitleSmall>Wybierz sale, do których nie masz zamiaru chodzić</TitleSmall>
            </Row>
            <br/>
            <Row>
                <Subtitle>
                    Na przykład nie chce ci się latać do dcfu albo do knh7 bo to wysoko i po co się męczyć
                </Subtitle>
            </Row>
            <br/>
            <Row>
                <Select
                    key={"undesirable-venues-select"}
                    options={venues}
                    isMulti
                    placeholder={'...'}
                    onChange={handleUndisirableVenuesChange}
                    value={selectedUndiserableVenues}
                />
            </Row>

            <br/>
            <br/>
            <Row>
                <Col>
                    <CheckboxToggle
                        id="checkbox-toggle-component-1"
                        label="Nie chce mi się nigdzie łazić, chcę żyć w knh, tylko i wyłącznie"
                        value={toggleKnhOnly}
                        onChange={handleKnhOnlyOnChange}
                    />
                </Col>

            </Row>
            <br/>
        </Container>
    )
}

export default VenuesPickerComponent;