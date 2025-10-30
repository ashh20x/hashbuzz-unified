import Typography from '../../Typography/Typography';
import { CardContainer, IconWrapper, TextWrapper } from './Card.styles';
export const Card = ({ title, icon }) => {
  const theme = {
    color: '#696969',
    size: '14px',
    weight: '600',
  };

  return (
    <CardContainer>
      <IconWrapper>{icon}</IconWrapper>
      <TextWrapper>
        <Typography theme={theme}>{title}</Typography>
      </TextWrapper>
    </CardContainer>
  );
};

export default Card;
