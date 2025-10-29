import styled from 'styled-components';

export const ContainerWrapper = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  padding: 0;

  @media (max-width: 768px) {
    padding: 0;
    min-height: 100vh;
  }

  @media (max-width: 480px) {
    padding: 0;
  }
`;
