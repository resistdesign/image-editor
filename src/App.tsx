import { FC } from "react";
import {ProjectView} from "./App/ProjectView";
import {createGlobalStyle} from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: 100vw;
    height: 100vh;

    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    gap: 1em;
  }
`;

export const App: FC = () => {
  return (
    <>
      <GlobalStyle/>
      <ProjectView>

      </ProjectView>
    </>
  );
};
