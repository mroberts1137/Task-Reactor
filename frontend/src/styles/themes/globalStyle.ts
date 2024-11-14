import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-family: courier, 'Nunito', sans-serif;
    font-size: 22px;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  body {
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
    transition: background-color 0.3s, color 0.3s;
  }
`;

export default GlobalStyle;
