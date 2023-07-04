import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import {Application, Button} from 'react-rainbow-components';
import {Subtitle, theme, Title} from './selectStyles'
import StepsComponent from "./components/StepsComponent";
import MoviePickerComponent from "./components/MoviePickerComponent";
import {Col, ListGroup, ListGroupItem, Spinner} from "react-bootstrap";
import SectionsPickerComponent from "./components/SectionsPickerComponent";
import VenuesPickerComponent from "./components/VenuesPickerComponent";
import DateRangePickerComponent from "./components/DateRangesPickerComponent";
import AccordionActivityTimeline from "./components/TimelineComponent";
import Row from "react-bootstrap/Row";


function App() {
    const [step, setStep] = useState(1);
    const [allDays, setAllDays] = useState([]);
    const [freeMovies, setFreeMovies] = useState([]);
    const [freeVenues, setFreeVenues] = useState([]);
    const [freeSections, setFreeSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [resultSchedule, setResultSchedule] = useState({});
    const [togglesDateRangesMorningShow, setTogglesDateRangesMorningShow] = useState({
        toggleEveningShows: false,
        toggleMorningShows: false
    });

    const [moviesFormData, setMoviesFormData] = useState({
        niceToSeeMovies: [],
        mustSeeMovies: [],
        undesirableMovies: []
    });
    const [sectionsFormData, setSectionsFormData] = useState({
        undesirableSections: [],
        favouriteSections: []
    });
    const [venuesFormData, setVenuesFormData] = useState({
        undesirableVenues: []
    });

    const [dateRangesFormData, setDateRangesFormData] = useState({
        undesirableDateRanges: []
    })

    const handleMoviesFormDataChange = (newMovieName, newMovieValue) => {
        setMoviesFormData((prevData) => ({
            ...prevData,
            [newMovieName]: newMovieValue,
        }));
    };

    const handleSectionsFormDataChange = (newSectionName, newSectionValue) => {
        setSectionsFormData((prevData) => ({
            ...prevData,
            [newSectionName]: newSectionValue,
        }));
    };

    const handleVenuesFormDataChange = (newVenueName, newVenueValue) => {
        setVenuesFormData((prevData) => ({
            ...prevData,
            [newVenueName]: newVenueValue,
        }));
    };

    const handleDatesToggleChange = (newToggleName, newToggleValue) => {
        setTogglesDateRangesMorningShow(
            (prevData) => ({
                    ...prevData,
                    [newToggleName]: newToggleValue,
                }
            ));
    }


    const handleDateRangesFormDataChange = (newDateRangeName, newDateRangeValue) => {
        setDateRangesFormData((prevData) => ({
            ...prevData,
            [newDateRangeName]: newDateRangeValue,
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/screenings');
                const data = await response.json();
                const moviesList = [...new Map(data.map(item => [item['movie_id'], item])).values()].sort();
                const daysList = Array.from(new Set(data.map((item) => item.day)));
                const venuesList = Array.from(new Set(data.map((item) => item.venue)));
                const sectionsList = Array.from(new Set(data.map((item) => item.section)));

                setFreeMovies(moviesList.map(movie => {
                    return {
                        label: movie.title, value: movie, key: movie.movie_id
                    }
                }));
                setFreeSections(sectionsList.map((s, index) => {
                    return {
                        label: s, value: s, key: index
                    }
                }));
                setFreeVenues(venuesList.map((venue, index) => {
                    return {
                        label: venue, value: venue, key: index
                    }
                }));
                setAllDays(daysList);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleNextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleFinish = () => {
        setStep(5);
    }

    const createEvents = (day_events) => {
        const screenings_as_events = [];
        day_events.map((screening) => (
            screenings_as_events.push(
                {
                    name: `${new Date(screening.start_date).toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "long",
                        weekday: 'long'
                    })}`,
                    description: `${screening.title} w ${screening.venue} o ${new Date(screening.start_date).toLocaleDateString("pl-PL")}`,
                    details: {
                        title: screening.title,
                        section: screening.section,
                        duration: screening.duration,
                        start_time: screening.start_date,
                        end_time: screening.end_date,
                        venue: screening.venue
                    },
                }
            )));
        // screenings_as_events.sort((a, b) => b.details.start_date.localeCompare(a.details.start_date));
        screenings_as_events.sort((a, b) => new Date(a.details.start_time) - new Date(b.details.start_time));
        return screenings_as_events;
    }

    const handleFormSubmit = () => {
        setIsLoading(true);
        let resultsJson = {
            movies: {
                mustSeeMovies: moviesFormData["mustSeeMovies"].map(entry => entry.value.movie_id),
                niceToSeeMovies: moviesFormData["niceToSeeMovies"].map(entry => entry.value.movie_id),
                undesirableMovies: moviesFormData["undesirableMovies"].map(entry => entry.value.movie_id)
            },
            sections: {
                undesirableSections: sectionsFormData["undesirableSections"].map(entry => entry.value),
                favouriteSections: sectionsFormData["favouriteSections"].map(entry => entry.value)
            },
            venues: {
                undesirableVenues: venuesFormData["undesirableVenues"].map(entry => entry.value),
            },
            dateRanges: {
                undesirableDateRanges: dateRangesFormData["undesirableDateRanges"].map(entry => ({
                    date: entry.date.label,
                    from: entry.from,
                    to: entry.to
                }))
            }

        }
        fetch('http://127.0.0.1:5000/schedule', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(resultsJson),
        })
            .then((response) => {
                response.json().then((data) => {
                    setResultSchedule(data);
                    setIsLoading(false);
                    setStep(100);
                })
            })
            .catch((error) => {
                console.error('Error submitting form:', error);
            });
    };

    const renderFormStep = () => {
        switch (step) {
            case 1:
                return (
                    <MoviePickerComponent
                        initialMovies={freeMovies}
                        initialSelectedMustSeeMovies={moviesFormData["mustSeeMovies"]}
                        initialSelectedNiceToHaveMovies={moviesFormData["niceToSeeMovies"]}
                        initialSelectedUndesirableMovies={moviesFormData["undesirableMovies"]}
                        onFormDataChange={handleMoviesFormDataChange} // Pass the callback fun
                    > < /MoviePickerComponent>
                )
            case 2:
                return (
                    <VenuesPickerComponent
                        initialVenues={freeVenues}
                        initialUndesirableVenues={venuesFormData["undesirableVenues"]}
                        onFormDataChange={handleVenuesFormDataChange} // Pass the callback fun
                    ></VenuesPickerComponent>
                );
            case 3:
                return (
                    <SectionsPickerComponent
                        initialSections={freeSections}
                        initialFavouriteSections={sectionsFormData["favouriteSections"]}
                        initialUndesirableSections={sectionsFormData["undesirableSections"]}
                        onFormDataChange={handleSectionsFormDataChange} // Pass the callback fun
                    ></SectionsPickerComponent>
                );
            case 4:
                return (
                    <DateRangePickerComponent
                        availableDays={allDays}
                        initialRanges={dateRangesFormData["undesirableDateRanges"]}
                        onFormDataChange={handleDateRangesFormDataChange}
                        onToggleChange={handleDatesToggleChange}
                        initialToggleData={togglesDateRangesMorningShow}
                    ></DateRangePickerComponent>
                )
                    ;
            case 5:
                return (
                    <Container>

                        <Row>filmy must see:</Row>
                        <Row>
                            <ListGroup>
                                {moviesFormData["mustSeeMovies"].map((m) => (
                                    <ListGroupItem> {m.value.title} </ListGroupItem>))}
                            </ListGroup>
                        </Row>
                        <Row>filmy nice to see:</Row>
                        <Row>
                            <ListGroup>
                                {moviesFormData["niceToSeeMovies"].map((m) => (
                                    <ListGroupItem> {m.value.title} </ListGroupItem>))}
                            </ListGroup>
                        </Row>
                        <Row>
                            <span>filmy don't wanna see:</span>
                        </Row>
                        <Row>
                            <ListGroup>
                                {moviesFormData["undesirableMovies"].map((m) => (
                                    <ListGroupItem> {m.value.title} </ListGroupItem>))}
                            </ListGroup>
                        </Row>
                        <Row>
                            <Subtitle>nie chce tam isc:</Subtitle>
                        </Row>
                        <Row>
                            <ListGroup>
                                {venuesFormData["undesirableVenues"].map((m) => (
                                    <ListGroupItem> {m.value} </ListGroupItem>))}
                            </ListGroup>
                        </Row>
                        <Row>
                            <Subtitle>nie chce tej sekcji:</Subtitle>
                        </Row>
                        <Row>
                            <ul>
                                {sectionsFormData["undesirableSections"].map((m) => (
                                    <li> {m.value} </li>))}
                            </ul>
                        </Row>

                        <Row>
                            <Subtitle>umre bez tej sekcji:</Subtitle>
                        </Row>
                        <Row>
                            <ListGroup>
                                {sectionsFormData["favouriteSections"].map((m) => (
                                    <ListGroupItem> {m.value} </ListGroupItem>))}
                            </ListGroup>
                        </Row>

                        <Row>
                            <span>tych dat mi nie dawać:</span>
                        </Row>
                        <Row>
                            <ListGroup>
                                {dateRangesFormData["undesirableDateRanges"].map((dr) => (
                                    <ListGroupItem> {`w ${dr.date.value.toLocaleString("pl-PL", {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "short"
                                    })} od ${dr.from} do ${dr.to}`} </ListGroupItem>))}
                            </ListGroup>
                        </Row>


                    </Container>
                )
            case 100:
                return (
                    <div>
                        {
                            Object.keys(resultSchedule).map((key, index) => (
                                <AccordionActivityTimeline
                                    eventsList={createEvents(resultSchedule[key])}
                                    idx={index}
                                    name={new Date(resultSchedule[key][0].start_date).toLocaleDateString("pl-PL", {
                                        timeZone: "Europe/Warsaw",
                                        "day": "numeric",
                                        month: "short",
                                        weekday: 'long'
                                    })}
                                    description={`${resultSchedule[key].length} filmów`}
                                >

                                </AccordionActivityTimeline>
                            ))
                        }
                    </div>
                )
            default:
                return null;
        }
    };

    return (<Application theme={theme} className="rainbow-p-vertical_xx-large rainbow-align-content_center">

        {isLoading ? (
                <div className="rainbow-p-around_large">
                    <Spinner size="large"/>
                </div>
            ) :
            <Container>
                <Row>
                    <Title>Nowe Horyzonty 2023</Title>
                </Row>
                <br/>
                <br/>
                <Row>
                    <StepsComponent step={step}></StepsComponent>
                </Row>
                <br/>
                <br/>
                <br/>
                <Row>
                    <Col>{renderFormStep()}</Col>

                </Row>
                <br/>
                <Row>
                    <Col style={{display: 'flex', justifyContent: 'right'}}>
                        <div className="rainbow-flex">
                            {step > 1 && step <= 5 && (<Button onClick={handlePreviousStep}>Wstecz</Button>)}
                            <Col></Col>
                            {step < 4 && (<Button onClick={handleNextStep}>Dalej</Button>)}
                            <Col></Col>
                            {step === 4 && (<Button onClick={handleFinish}>Poka podsumowanie</Button>)}
                            <Col></Col>
                            {step === 5 && (<Button onClick={handleFormSubmit}>Wyślij ofizjal</Button>)}
                        </div>
                    </Col>
                </Row>
            </Container>
        }


    </Application>)
        ;
}

export default App;