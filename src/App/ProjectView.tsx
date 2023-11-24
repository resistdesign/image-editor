import { FC } from "react";
import styled from "styled-components";
import { LayerList } from "./CanvasView/LayerList";

const Layout = styled.div`
  display: grid;
  grid-template-areas: "header header" "sidebar main";
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 5fr;
  width: 100%;
  height: 100%;
  gap: 1em;
  overflow: hidden;
  padding: 1em;
`;
const Header = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1em;
  overflow: hidden;
  grid-area: header;
`;
const Sidebar = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1em;
  overflow: auto;
  grid-area: sidebar;
  min-width: 10em;
`;
const Main = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1em;
  overflow: auto;
  grid-area: main;
`;

export const ProjectView: FC = () => {
  return (
    <Layout>
      <Header>
        <h2>
          Image Editor
        </h2>
      </Header>
      <Sidebar>
        <LayerList />
      </Sidebar>
      <Main>Main</Main>
    </Layout>
  );
};
