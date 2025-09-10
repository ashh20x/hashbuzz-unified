import styled from 'styled-components';

export const Footer = styled.footer`
  background-color: rgba(0, 96, 231, 0.75);
`;

export const FooterContiner = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  color: #fff;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  padding-bottom: 50px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FooterColumn = styled.div`
  flex: 1;
  padding: 10px;
  flex-direction: column;
  align-items: center;

  & > a {
    display: inline-block;
  }

  h4 {
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 5px;

      a {
        color: #fff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

export const FooterLogo = styled.img`
  max-width: 100px;
`;
