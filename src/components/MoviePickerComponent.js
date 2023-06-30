import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {Subtitle} from "../selectStyles";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import React, {useEffect, useState} from "react";

const currentMoviesState = {
    selectedMustSeeMovies: [],
    selectedNiceToSeeMovies: [],
    selectedUndesirableMovies: []
}


const [selectedMustSeeMovies, setSelectedMustSeeMovies] = useState([]);
const [selectedNiceToSeeMovies, setSelectedNiceToSeeMovies] = useState([]);
const [selectedUndiserableMovies, setSelectedUndiserableMovies] = useState([]);

const [freeMovies, setFreeMovies] = useState([]);

useEffect(() => {
        const leftMovies = freeMovies
            .filter(m => !selectedMustSeeMovies.includes(m)
                && !selectedNiceToSeeMovies.includes(m) && !selectedUndiserableMovies.includes(m));
        setFreeMovies(leftMovies);
    }, [selectedMustSeeMovies, selectedUndiserableMovies, selectedNiceToSeeMovies]
)



function MoviePickerComponent(props) {
    return (
        <Container>
            <Row>
                <Subtitle>Wybierz filmy bez których umrzesz (max 15)</Subtitle>
                <Select
                    key={"must-see-movies-select"}
                    options={freeMovies}
                    isOptionDisabled={() => selectedMustSeeMovies.length >= 15}
                    isMulti
                    onChange={handleSelectMustSeeMoviesChange(option)}
                />
            </Row>
            <Row>
                <Form.Label>
                    Wybierz filmy które byś chciał obczaić ale nie aż tak bardzo jak tamte poprzednie
                    (max
                    15)
                </Form.Label>
                <Select
                    key={"nice-to-see-movies-select"}
                    options={freeMovies}
                    isOptionDisabled={() => selectedNiceToSeeMovies.length >= 15}
                    isMulti
                    onChange={handleNiceToSeeMoviesChange}
                />
            </Row>

            <Row>
                <Form.Label>
                    Filmy, których absolutnie nie chcesz widzieć nidgdy
                </Form.Label>
                <Select
                    key={"undesirable-movies-select"}
                    options={freeMovies}
                    isMulti
                    onChange={handleUndisirableMoviesChange}
                />
            </Row>
        </Container>
    )
}
export default MoviePickerComponent;