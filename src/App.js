import React, {useEffect, useState} from 'react';
import Select from 'react-select'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {Application, Button, DateTimePicker, ProgressIndicator, ProgressStep} from 'react-rainbow-components';
import {StyledCard, Subtitle, theme, Title} from './selectStyles'
import StepsComponent from "./components/StepsComponent";
import styled from 'styled-components';
import MoviePickerComponent from "./components/MoviePickerComponent";
const [childMovieData, setChildMovieData] = useState({});


function App() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        niceToSeeMovies: [],
        mustSeeMovies: [],
        undesirableMovies: [],
        undesirableVenues: [],
        undesirableSections: [],
        favouriteSections: []
    });

    // const [allVenues, setAllVenues] = useState([]);
    // const [allSections, setAllSections] = useState([]);
    // const [allMovies, setAllMovies] = useState([]);
    const [selectedMustSeeMovies, setSelectedMustSeeMovies] = useState([]);
    const [selectedNiceToSeeMovies, setSelectedNiceToSeeMovies] = useState([]);
    const [selectedUndiserableMovies, setSelectedUndiserableMovies] = useState([]);
    const [selectedUndiserableVenues, setSelectedUndiserableVenues] = useState([]);
    const [selectedUndiserableSections, setSelectedUndiserableSections] = useState([]);
    const [selectedFavouriteSections, setSelectedFavouriteSections] = useState([]);
    const [selectedRanges, setSelectedRanges] = useState([]);
    const [selectedDateTime, setSelectedDateTime] = useState();

    const [freeMovies, setFreeMovies] = useState([]);
    const [freeVenues, setFreeVenues] = useState([]);
    const [freeSections, setFreeSections] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/screenings');
                const data = await response.json();
                const moviesList = [...new Map(data.map(item => [item['movie_id'], item])).values()].sort();
                // const daysList = Array.from(new Set(data.map((item) => item.day)));
                const venuesList = Array.from(new Set(data.map((item) => item.venue)));
                const sectionsList = Array.from(new Set(data.map((item) => item.section)));

                // setAllMovies(moviesList);
                setFreeMovies(moviesList.map(movie => {
                    return {
                        label: movie.title, value: movie, key: movie.movie_id
                    }
                }));
                // setAllDays(daysList);
                // setAllSections(sectionsList);
                setFreeSections(sectionsList.map((s, index) => {
                    return {
                        label: s, value: s, key: index
                    }
                }));
                // setFreeVenues()
                // setAllVenues(venuesList);
                setFreeVenues(venuesList.map((venue, index) => {
                    return {
                        label: venue, value: venue, key: index
                    }
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
            const leftMovies = freeMovies
                .filter(m => !selectedMustSeeMovies.includes(m)
                    && !selectedNiceToSeeMovies.includes(m) && !selectedUndiserableMovies.includes(m));
            setFreeMovies(leftMovies);
        }, [selectedMustSeeMovies, selectedUndiserableMovies, selectedNiceToSeeMovies]
    )

    useEffect(() => {
        const leftVenues = freeVenues.filter(v => !selectedUndiserableVenues.includes(v));
        setFreeVenues(leftVenues);
    }, [selectedUndiserableVenues]);

    useEffect(() => {
        const leftSections = freeSections.filter(s => !selectedFavouriteSections.includes(s) && !selectedUndiserableSections.includes(s));
        setFreeSections(leftSections);
    }, [selectedUndiserableSections, selectedFavouriteSections]);

    useEffect(() => {
        setSelectedRanges(selectedRanges + selectedDateTime)
    }, [selectedDateTime])

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(event);
    };

    const handleSelectMustSeeMoviesChange = (selectedOptions) => {
        setSelectedMustSeeMovies(selectedOptions);
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

    const handleUndisirableVenuesChange = (selectedOptions) => {
        setSelectedUndiserableVenues(selectedOptions);
        handleChange({target: {name: "undesirableVenues", value: selectedOptions}});
    };

    const handleUndisirableSectionsChange = (selectedOptions) => {
        setSelectedUndiserableSections(selectedOptions);
        handleChange({target: {name: "undesirableSections", value: selectedOptions}});
    };

    const handleFavouriteSectionsChange = (selectedOptions) => {
        setSelectedFavouriteSections(selectedOptions);
        handleChange({target: {name: "favouriteSections", value: selectedOptions}});
    };

    const handleNextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleFinish = () => {
        setStep(100);
    }

    const handleFormSubmit = () => {
        fetch('http://127.0.0.1:5000/schedule', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Form submitted successfully:', data);
            })
            .catch((error) => {
                console.error('Error submitting form:', error);
            });
    };

    const renderFormStep = () => {
        switch (step) {
            case 1:
                return (
                    <Container>
                            <Row>
                                <Subtitle>Wybierz filmy bez których umrzesz (max 15)</Subtitle>
                                <Select
                                    key={"must-see-movies-select"}
                                    options={freeMovies}
                                    isOptionDisabled={() => selectedMustSeeMovies.length >= 15}
                                    isMulti
                                    onChange={handleSelectMustSeeMoviesChange}
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
            //         <MoviePickerComponent
            //             freeMovies
            //             handleSelectMustSeeMoviesChange
            //             selectedMustSeeMovies
            //             handleNiceToSeeMoviesChange
            //             selectedNiceToSeeMovies
            //             handleUndisirableMoviesChange
            // > < /MoviePickerComponent>
            )
            case 2:
                return (
                    <Container>
                        <Form.Group>
                            <Form.Label>
                                Daj znać jeśli bardzo nie chcesz iść do którejś z lokacji bo nie chce ci się lecieć
                                do
                                dcfu
                                albo do knh7 bez windy
                            </Form.Label>
                            <Select
                                key={"undesirable-venues-select"}
                                options={freeVenues}
                                isMulti
                                onChange={handleUndisirableVenuesChange}
                            />
                        </Form.Group>
                    </Container>
                );
            case 3:
                return (
                    <Container>
                        <Form.Group>
                            <Form.Label>Daj znać, które sekcje Cię literalnie zabiją</Form.Label>
                            <Select
                                key={"undesirable-sections-select"}
                                options={freeSections}
                                isMulti
                                onChange={handleUndisirableSectionsChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Daj znać, które sekcje MUSISZ</Form.Label>
                            <Select
                                key={"favourite-sections-select"}
                                options={freeSections}
                                isMulti
                                onChange={handleFavouriteSectionsChange}
                            />
                        </Form.Group>
                    </Container>
                );
            case 4:
                return (
                    <Container>
                        <Form.Group>
                            <Form.Label>Które dni nie pasują</Form.Label>
                            <div
                                className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto"
                                // style={containerStyles}
                            >
                                <DateTimePicker
                                    id="datetimepicker-1"
                                    label="DateTimePicker label"
                                    // value={state.value}
                                    onChange={value => setSelectedDateTime({value})}
                                    formatStyle="large"
                                    // locale={state.locale.name}
                                    // okLabel={okButtonLocalizedLabel[state.locale.name]}
                                    // cancelLabel={cancelButtonLocalizedLabel[state.locale.name]}
                                />
                            </div>

                        </Form.Group>
                    </Container>
                )
                    ;
            case 5:
                return (
                    <div>
                        <h2>WYNIK</h2>
                        <span>filmy must see:</span>
                        <ul>
                            {formData["mustSeeMovies"].map((m) => (
                                <li> {m.value.title} </li>))}
                        </ul>
                        <span>filmy nice to see:</span>
                        <ul>
                            {formData["niceToSeeMovies"].map((m) => (
                                <li> {m.value.title} </li>))}
                        </ul>
                        <span>filmy don't wanna see:</span>
                        <ul>
                            {formData["undesirableMovies"].map((m) => (
                                <li> {m.value.title} </li>))}
                        </ul>
                        <span>nie chce tam isc:</span>
                        <ul>
                            {formData["undesirableVenues"].map((m) => (
                                <li> {m.value} </li>))}
                        </ul>
                        <span>nie chce tej sekcji:</span>
                        <ul>
                            {formData["undesirableSections"].map((m) => (
                                <li> {m.value} </li>))}
                        </ul>
                        <span>umre bez tej sekcji:</span>
                        <ul>
                            {formData["favouriteSections"].map((m) => (
                                <li> {m.value} </li>))}
                        </ul>
                    </div>
                )
            default:
                return null;
        }
    };

    return (<Application theme={theme} className="rainbow-p-vertical_xx-large rainbow-align-content_center">
        <div className="rainbow-p-around_large">
            <Title>Hello</Title>
            <StepsComponent step={step}></StepsComponent>
            <StyledCard className="rainbow-flex rainbow-flex_column rainbow-align_center ">
                {renderFormStep()}
                <div className="rainbow-align-content_space-between">
                    <div className="rainbow-flex">
                        {step > 1 && step < 5 && (<Button onClick={handlePreviousStep}>Previous</Button>)}
                        {step < 4 && (<Button onClick={handleNextStep}>Next</Button>)}
                        {step === 4 && (<Button onClick={handleFinish}>POKA</Button>)}
                    </div>
                </div>
            </StyledCard>
        </div>
    </Application>);
}

export default App;