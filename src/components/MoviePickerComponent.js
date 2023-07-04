import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {Subtitle, TitleSmall} from "../selectStyles";
import Select from "react-select";
import React, {useEffect, useState} from "react";
import {Col} from "react-bootstrap";
import {CheckboxToggle} from "react-rainbow-components";

function MoviePickerComponent({
                                  initialMovies,
                                  initialSelectedMustSeeMovies,
                                  initialSelectedNiceToHaveMovies,
                                  initialSelectedUndesirableMovies,
                                  onFormDataChange
                              }) {
    const [selectedMustSeeMovies, setSelectedMustSeeMovies] = useState([]);
    const [selectedNiceToSeeMovies, setSelectedNiceToSeeMovies] = useState([]);
    const [selectedUndiserableMovies, setSelectedUndiserableMovies] = useState([]);

    const [movies, setMovies] = useState([]);
    const [toggleWangBing, setToggleWangBing] = useState(true);
    const wangBingId = 11111;

    const handleChange = (event) => {
        const {name, value} = event.target;
        onFormDataChange(name, value);
    };

    const handleSelectMustSeeMoviesChange = (selectedOptions) => {
        setSelectedMustSeeMovies(selectedOptions);
        if (!selectedOptions.find(m => m.key === wangBingId)) {
            setToggleWangBing(false);
        }
        handleChange({target: {name: "mustSeeMovies", value: selectedOptions}});
    };

    const handleNiceToSeeMoviesChange = (selectedOptions) => {
        setSelectedNiceToSeeMovies(selectedOptions);
        handleChange({target: {name: "niceToSeeMovies", value: selectedOptions}});
    };

    const handleUndisirableMoviesChange = (selectedOptions) => {
        setSelectedUndiserableMovies(selectedOptions);
        handleChange({target: {name: "undesirableMovies", value: selectedOptions}});
    };

    const handleWangBingOnChange = () => {
        setToggleWangBing(!toggleWangBing);
    }

    useEffect(() => {
        if (initialMovies && initialMovies.length > 0) {
            setMovies(initialMovies);
        }
        if (initialSelectedMustSeeMovies && initialSelectedMustSeeMovies.length > 0) {
            setSelectedMustSeeMovies(initialSelectedMustSeeMovies);
        }
        if (initialSelectedNiceToHaveMovies && initialSelectedNiceToHaveMovies.length > 0) {
            setSelectedNiceToSeeMovies(initialSelectedNiceToHaveMovies);
        }
        if (initialSelectedUndesirableMovies && initialSelectedUndesirableMovies.length > 0) {
            setSelectedUndiserableMovies(initialSelectedUndesirableMovies);
        }
    }, []);

    useEffect(() => {
            const leftMovies = initialMovies
                .filter(m => !selectedMustSeeMovies.includes(m)
                    && !selectedNiceToSeeMovies.includes(m) && !selectedUndiserableMovies.includes(m));
            setMovies(leftMovies);
        }, [selectedMustSeeMovies, selectedUndiserableMovies, selectedNiceToSeeMovies]
    )

    useEffect(() => {
        setMovies(initialMovies);
    }, [initialMovies]);

    useEffect(() => {
        if (toggleWangBing) {
            if (!selectedMustSeeMovies.find(m => m.key === wangBingId) && !initialSelectedMustSeeMovies.find(m => m.key === wangBingId)) {
                const theWangBingMovie = initialMovies.find(m => m.key === wangBingId);
                setSelectedMustSeeMovies((prevMovies) => [...prevMovies, theWangBingMovie]);
                handleChange({target: {name: "mustSeeMovies", value: [theWangBingMovie]}});
            }
        } else {
            const moviesWithoutWang = selectedMustSeeMovies.filter(movie => movie.key !== wangBingId);
            setSelectedMustSeeMovies(moviesWithoutWang);
            handleChange({target: {name: "mustSeeMovies", value: moviesWithoutWang}});
        }
    }, [toggleWangBing])

    return (
        <Container>
            <Row>
                <TitleSmall>Wybierz filmy</TitleSmall>
            </Row>
            <Row>
                <Subtitle>Wybierz filmy takie MUST SEE, że normalnie musisz a jak się nie uda to umrzesz (max
                    15)</Subtitle>
                <Select
                    key={"must-see-movies-select"}
                    options={movies}
                    isOptionDisabled={() => selectedMustSeeMovies.length >= 15}
                    isMulti
                    onChange={handleSelectMustSeeMoviesChange}
                    placeholder={"..."}
                    value={selectedMustSeeMovies}
                />
            </Row>
            <br/>
            <br/>
            <Row>
                <div>
                    <Subtitle>
                        Wybierz filmy które byś chciał obczaić ale nie aż tak bardzo jak tamte poprzednie
                        (max 15)
                    </Subtitle>
                    <Select
                        key={"nice-to-see-movies-select"}
                        options={movies}
                        isOptionDisabled={() => selectedNiceToSeeMovies.length >= 15}
                        isMulti
                        onChange={handleNiceToSeeMoviesChange}
                        placeholder={"..."}
                        value={selectedNiceToSeeMovies}
                    />
                </div>
            </Row>
            <br/>
            <br/>
            <Row>
                <Subtitle>
                    A teraz filmy, które już widziałeś albo kompletnie nie masz ochoty bo nie
                </Subtitle>
                <Select
                    key={"undesirable-movies-select"}
                    options={movies}
                    isMulti
                    onChange={handleUndisirableMoviesChange}
                    placeholder={"..."}
                    value={selectedUndiserableMovies}
                />
            </Row>

            <br/>
            <Row>
                <Col>
                    <CheckboxToggle
                        id="checkbox-toggle-component-1"
                        label="Chcę 9h Wanga Binga"
                        value={toggleWangBing}
                        onChange={handleWangBingOnChange}
                    />
                </Col>
                <Col xs={8}>
                    <span hidden={toggleWangBing}>
                        (Nie jestem prawdziwym nowohoryzontowiczem i nie wiem co to KINO)
                    </span>
                </Col>

            </Row>
        </Container>
    )
}

export default MoviePickerComponent;