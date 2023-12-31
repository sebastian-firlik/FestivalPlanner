import {Card} from "react-rainbow-components";
import styled from 'styled-components';

export const theme = {
    rainbow: {
        palette: {
            brand: '#095ac0',
        },
    },
};

export const Subtitle = styled.h2`
  font-family: 'Lato Light';
  font-size: 16px;
  font-weight: 1200;
  text-align: center;
  color: ${props => props.theme.rainbow.palette.text.header};
  ${props => props.uppercase && 'text-transform: uppercase;'}
`;


export const StyledCard = styled(Card)`
  width: 900px;
  height: 500px;
`;

export const Title = styled.h1.attrs(props => props.theme.rainbow)`
  font-family: 'Lato Light';
  font-size: 32px;
  text-align: center;
  color: ${props => props.palette.text.main};
`;

export const TitleSmall = styled.h2.attrs(props => props.theme.rainbow)`
  font-family: 'Lato Light';
  font-size: 20px;
  text-align: center;
  color: ${props => props.palette.text.main};
`;