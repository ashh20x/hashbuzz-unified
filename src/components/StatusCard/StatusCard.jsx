import Typography from "../../Typography/Typography";
import SecondaryButton from "../Buttons/SecondaryButton";
import { CardContainer, ButtonSection } from "./StatusCard.styles";

const StatusCard = ({ title, content, buttonTag, isButton, buttonClick }) => {
  const TitleTheme = {
    color: "#000",
    size: "16px",
    weight: "500",
  };
  const ContentTheme = {
    color: "#FDAF0D",
    size: "24px",
    weight: "300",
  };
  return (
    <CardContainer>
      <Typography theme={TitleTheme}>{title}:</Typography>
      <Typography theme={ContentTheme}>{content}</Typography>
      <ButtonSection>
        {isButton &&
          buttonTag.map((item) => (
            <SecondaryButton text={item} variant="contained" width="91px" margin="5%" onclick={()=>buttonClick(item)}/>
          ))}
      </ButtonSection>
    </CardContainer>
  );
};

export default StatusCard;
