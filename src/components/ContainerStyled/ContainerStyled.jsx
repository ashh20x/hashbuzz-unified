import styled from "styled-components";

export const ContainerStyled = styled.div`
margin: 0px 4%;
background-color: ${({ theme: { colors } }) => colors.white};
box-shadow: 0px 4px 58px rgba(193, 193, 193, 0.25);
border-radius: 20px;

flex-grow: 0.9;
padding: 5vh;
display: flex;
flex-direction: column;
justify-content: ${({ justify }) => (justify ? justify : '')};
align-items: ${({ align }) => (align ? align : '')};
text-align: center;
font-family: Poppins;

@media (max-width: 960px) {
    padding: 3vh;
  }
`;