import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Select from "react-select";
import Row from "react-bootstrap/Row";
import {Subtitle, TitleSmall} from "../selectStyles";

function SectionsPickerComponent({
                                     initialSections,
                                     initialUndesirableSections,
                                     initialFavouriteSections,
                                     onFormDataChange
                                 }) {
    const [selectedUndiserableSections, setSelectedUndiserableSections] = useState([]);
    const [selectedFavouriteSections, setSelectedFavouriteSections] = useState([]);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        if (initialSections && initialSections.length > 0) {
            setSections(initialSections);
        }
        if (initialUndesirableSections && initialUndesirableSections.length > 0) {
            setSelectedUndiserableSections(initialUndesirableSections);
        }
        if (initialFavouriteSections && initialFavouriteSections.length > 0) {
            setSelectedFavouriteSections(initialFavouriteSections);
        }
    }, []);

    useEffect(() => {
        const leftSections = initialSections.filter(s => !selectedFavouriteSections.includes(s) && !selectedUndiserableSections.includes(s));
        setSections(leftSections);
    }, [selectedUndiserableSections, selectedFavouriteSections]);

    useEffect(() => {
        setSections(initialSections);
    }, [initialSections]);

    const handleChange = (event) => {
        const {name, value} = event.target;
        onFormDataChange(name, value);
    };

    const handleUndisirableSectionsChange = (selectedOptions) => {
        setSelectedUndiserableSections(selectedOptions);
        handleChange({target: {name: "undesirableSections", value: selectedOptions}});
    };

    const handleFavouriteSectionsChange = (selectedOptions) => {
        setSelectedFavouriteSections(selectedOptions);
        handleChange({target: {name: "favouriteSections", value: selectedOptions}});
    };

    return (
        <Container>
            <Row>
                <TitleSmall>Wybierz sekcje</TitleSmall>
            </Row>
            <br/>
            <br/>
            <Row>
                <Subtitle>Takie, które no koniecznie byś chciałx zobaczyć, typu Froncik wizualny</Subtitle>
            </Row>
            <br/>
            <Row>
                <Select
                    key={"favourite-sections-select"}
                    placeholder={'...'}
                    options={sections}
                    value={selectedFavouriteSections}
                    isMulti
                    onChange={handleFavouriteSectionsChange}
                />
            </Row>
            <br/>
            <br/>
            <Row>
                <Subtitle>
                    A teraz sekcje, które wylatują z Twojego kalendarza bo Raya to masz obcykanego od podstawówki
                </Subtitle>
            </Row>
            <br/>
            <Row>
                <Select
                    key={"undesirable-sections-select"}
                    options={sections}
                    value={selectedUndiserableSections}
                    placeholder={'...'}
                    isMulti
                    onChange={handleUndisirableSectionsChange}
                />
            </Row>

        </Container>
    )
}

export default SectionsPickerComponent;