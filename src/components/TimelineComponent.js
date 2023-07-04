import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityTimeline, TimelineMarker} from 'react-rainbow-components';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin: 36px 4rem 0;
`;

const StyledContentContainer = styled.div.attrs(props => {
    return props.theme.rainbow.palette;
})`
  border-radius: 1rem;
  padding: 2rem 5rem;
  background: ${props => props.background.highlight};
  color: ${props => props.text.main};
`;

const StyledContentHeader = styled.h3`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 0.5rem;
`;

const StyledItemsContainer = styled.h3`
  display: flex;
  align-items: center;
`;

const StyledLabel = styled.span.attrs(props => {
    return props.theme.rainbow.palette;
})`
  color: ${props => props.text.label};
  width: 100%;
  max-width: 250px;
  padding: 0.5rem 0;
`;

const StyledValue = styled.span.attrs(props => {
    return props.theme.rainbow.palette;
})`
  font-weight: bold;
  max-width: 250px;
  width: 100%;
  color: ${props => props.text.main};
`;

const EventDetails = ({title, section, duration, start_time, end_time, venue}) => {
    return (
        <StyledContentContainer>
            <StyledContentHeader>{title}</StyledContentHeader>
            <StyledLabel>{section}</StyledLabel>
            <StyledItemsContainer>
                <StyledLabel>Czas trwania</StyledLabel>
                <StyledValue>{duration}</StyledValue>
            </StyledItemsContainer>
            <StyledItemsContainer>
                <StyledLabel>Początek o:</StyledLabel>
                <StyledValue>{new Date(start_time).toLocaleTimeString("pl-PL", {
                    hour: '2-digit',
                    minute: '2-digit'
                })}</StyledValue>
            </StyledItemsContainer>
            <StyledItemsContainer>
                <StyledLabel>Koniec o:</StyledLabel>
                <StyledValue>{new Date(end_time).toLocaleTimeString("pl-PL", {
                    hour: '2-digit',
                    minute: '2-digit'
                })}</StyledValue>
            </StyledItemsContainer>
            <StyledItemsContainer>
                <StyledLabel>Miejsce:</StyledLabel>
                <StyledValue>{venue}</StyledValue>
            </StyledItemsContainer>
        </StyledContentContainer>
    );
};

const AccordionActivityTimeline = ({eventsList, name, idx}) => {
    const [activeEvents, setActiveEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const markers = useMemo(() => eventsList.map(event => {
        const {details} = event;
        return (
            <StyledContainer>
                <EventDetails
                    key={idx}
                    title={details.title}
                    section={details.section}
                    duration={details.duration}
                    start_time={details.start_time}
                    end_time={details.end_time}
                    venue={details.venue}
                />
            </StyledContainer>
        );
    }), [eventsList, loading]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 3000);
    }, []);

    const handleToggleEvent = useCallback(({activeSectionNames}) => {
        setActiveEvents(activeSectionNames);
    }, []);

    return (
        <StyledContainer>
            <ActivityTimeline
                variant="accordion"
                multiple
                activeSectionNames={activeEvents}
                onToggleSection={handleToggleEvent}
            >
                <TimelineMarker
                    key={idx}
                    name={name}
                    label={`${name}, ${markers.length} filmów`}
                    isLoading={loading}
                >
                    {markers}
                </TimelineMarker>
            </ActivityTimeline>
        </StyledContainer>
    );
};

export default AccordionActivityTimeline;
