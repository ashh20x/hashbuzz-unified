import styled from 'styled-components';
export const StyledCardGenUtility = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  @media only screen and (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  @media only screen and (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }
  width: 100%;
`;
