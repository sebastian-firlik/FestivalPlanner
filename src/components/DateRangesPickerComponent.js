import React, {useEffect, useState} from "react";
import {Button, CheckboxGroup, CheckboxToggle, TimePicker} from "react-rainbow-components";
import Select from "react-select";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import {Col, ListGroup, ListGroupItem} from "react-bootstrap";
import {Subtitle, Title, TitleSmall} from "../selectStyles";

class DateRange {
    constructor(from, to, date) {
        this.from = from;
        this.to = to;
        this.date = date;
    }
}

function DateRangePickerComponent({availableDays, initialRanges, onFormDataChange, onToggleChange, initialToggleData}) {
    const [selectedRanges, setSelectedRanges] = useState([]);
    const [selectedDate, setSelectedDate] = useState({});
    const [days, setDays] = useState();
    const [isTimeRangeValid, setIsTimeRangeValid] = useState(true);
    const [timeRangeValidationError, setTimeRangeValidationError] = useState("");
    const [toggleMorningShows, setToggleMorningShows] = useState(initialToggleData["toggleMorningShows"]);
    const [toggleEveningShows, setToggleEveningShows] = useState(initialToggleData["toggleEveningShows"]);

    const handleChange = (event) => {
        const {name, value} = event.target;
        onFormDataChange(name, value);
    };

    const [from, setFrom] = useState({time: '9:00'});
    const [to, setTo] = useState({time: '18:00'});

    useEffect(() => {
        if (availableDays && availableDays.length > 0) {
            const parsedDates = availableDays.map((day, idx) => {
                const dayDate = new Date(`2021-08-${day}`)
                const dateParsed = {
                    label: dayDate.toLocaleDateString("pl-PL", {day: "numeric", month: "short", weekday: 'long'}),
                    value: dayDate
                }
                return dateParsed;
            });
            setDays(parsedDates)
        }

        console.log(initialRanges);
        if (initialRanges && initialRanges.length > 0) {
            setSelectedRanges(initialRanges);
        }
    }, []);

    useEffect(() => {
        if (Date.parse(`01/01/2011 ${from.time}`) > Date.parse(`01/01/2011 ${to.time}`)) {
            setTimeRangeValidationError("Popraw zakres godzin")
            setIsTimeRangeValid(false)
        } else {
            setTimeRangeValidationError("")
            setIsTimeRangeValid(true)
        }
    }, [to, from])

    useEffect(() => {
        handleChange({target: {name: "undesirableDateRanges", value: selectedRanges}});
    }, [selectedRanges]);

    useEffect(() => {
        if (days) {
            if (toggleMorningShows) {
                setSelectedRanges((prevRanges) => [...prevRanges, ...days.map( day => {
                    return new DateRange(
                        "8:00",
                        "11:00",
                        day
                    );
                })]);
            } else {
                setSelectedRanges((prevRanges) => prevRanges.filter(pr => (!pr.from === "8:00" && !pr.to === "11:00")))
            }
            onToggleChange("toggleMorningShows", toggleMorningShows);
        }
    }, [toggleMorningShows]);

    useEffect(() => {
        if (days) {
            if (toggleEveningShows) {
                setSelectedRanges((prevRanges) => [...prevRanges, ...days.map( day => {
                    return new DateRange(
                        "21:45",
                        "23:59",
                        day
                    );
                })]);
            } else {
                setSelectedRanges((prevRanges) => prevRanges.filter(pr => (!pr.from === "21:45" && !pr.to === "23:59")))
            }
            onToggleChange("toggleEveningShows", toggleEveningShows);
        }
    }, [toggleEveningShows]);

    const handleSelectDateChange = (selectedDay) => {
        setSelectedDate(selectedDay);
    };

    const handleToggleMorningShowsChange = () => {
        setToggleMorningShows(!toggleMorningShows);
    }

    const handleToggleEveningShowsChange = () => {
        setToggleEveningShows(!toggleEveningShows);
    }

    const handleRemoveRange = (range) => {
        setSelectedRanges((prevRanges) =>
            prevRanges.filter((item) => item !== range)
        );
    };

    const addRange = () => {
        setSelectedRanges((prevRanges) => [...prevRanges, new DateRange(from.time, to.time, selectedDate)]);
    };


    return (
        <Container>
            <Row>
                <Title>Przedziały czasowe</Title>
                <br/>
                <TitleSmall>które Ci kompletnie nie odpowiadają bo masz prackę (ja) albo nie wiem, chcesz
                    iść na Barbie w piątek i musisz na to zrobić miejsce w kalendarzu</TitleSmall>
                <br/>
                <br/>
                <br/>
                <Subtitle>Tu jest trochę niewygodnie bo trzeba za każdym razem dodawać nowy przedział czasowy no ale tak
                    już jest, nie mamy UXa na pokładzie i nie znamy się na frontendzie</Subtitle>
            </Row>
            <br/>
            <br/>
            <Row className="align-items-center">
                <Col xs={4}>
                    <Select
                        options={days}
                        id="days-select-1"
                        isSearchable={false}
                        defaultValue={selectedDate}
                        // defaultLabel={"dfjdfk"}
                        onChange={handleSelectDateChange}
                        // className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                    />
                </Col>
                <Col xs={3}>
                    <TimePicker
                        value={from.time}
                        // label="Od"
                        onChange={value => setFrom({time: value})}
                        // style={containerStyles}
                        // className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        locale="pl-PL"
                        hour24
                        required
                    />
                </Col>
                <Col xs={3}>
                    <TimePicker
                        required
                        value={to.time}
                        // label="Do"
                        onChange={value => setTo({time: value})}
                        // style={containerStyles}
                        // className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        locale="pl-PL"
                        error={timeRangeValidationError}
                        hour24
                    />
                </Col>
                <Col xs={2}>
                    <Button
                        onClick={() => addRange()}
                        disabled={!isTimeRangeValid}
                    >
                        Dodaj
                    </Button>
                </Col>
            </Row>
            <br/>
            <br/>
            <Row>
                <Col>
                    <Row>
                        <CheckboxToggle
                            id="checkbox-toggle-morning-1"
                            label="Nie chcę wstawać na pierwszy pokaz"
                            value={toggleMorningShows}
                            onChange={handleToggleMorningShowsChange}
                        />
                    </Row>
                    <Row>
                        <CheckboxToggle
                            id="checkbox-toggle-evenning-1"
                            label="Jestem po 30, nie dam rady na ostatni slot"
                            value={toggleEveningShows}
                            onChange={handleToggleEveningShowsChange}
                        />
                    </Row>
                </Col>
                {/*<Col>*/}
                {/*    <CheckboxGroup*/}
                {/*        id="checkbox-group-1"*/}
                {/*        label="Dni"*/}
                {/*        options={days}*/}
                {/*        value={days}*/}
                {/*        onChange={handleOnCheckboxChange}*/}
                {/*    />*/}
                {/*</Col>*/}
            </Row>
            <br/>
            <br/>
            <Row>
                <TitleSmall>Obecnie dodane przedziały czasowe, w których nie możesz oglądać filmów :c</TitleSmall>
            </Row>
            <Row>
                <ListGroup>
                    {selectedRanges.map((range, index) => (
                        <ListGroupItem key={index}>
                            <Row>
                                <Col xs={8}>{range.date.label}, od: {range.from} do : {range.to}</Col>
                                <Col><Button onClick={() => handleRemoveRange(range)}>Usuń</Button></Col>

                            </Row>

                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Row>
        </Container>
    );
}

export default DateRangePickerComponent;
