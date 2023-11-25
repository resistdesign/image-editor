import {
  ChangeEvent as ReactChangeEvent,
  FC,
  FormEvent as ReactFormEvent,
  useCallback,
  useState,
} from "react";
import { Project } from "../../../Types/Project";
import styled from "styled-components";

const Layout = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
`;
const Controls = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
  gap: 1em;
`;
const ControlButton = styled.button`
  flex: 1 0 auto;
`;

export type CreateProjectViewProps = {
  createProject?: (project: Project) => void;
};

export const CreateProjectView: FC<CreateProjectViewProps> = ({
  createProject,
}) => {
  const [creatingNewProject, setCreatingNewProject] = useState(false);
  const [newProjectLabel, setNewProjectLabel] = useState("");
  const toggleCreatingNewProject = useCallback(() => {
    setCreatingNewProject(!creatingNewProject);
    setNewProjectLabel("");
  }, [creatingNewProject]);
  const onNewProjectLabelChange = useCallback(
    (event: ReactChangeEvent<HTMLInputElement>) => {
      setNewProjectLabel(event.target.value);
    },
    [],
  );
  const onCreateNewProject = useCallback(
    (event: ReactFormEvent) => {
      event.preventDefault();

      if (createProject && newProjectLabel) {
        const newProject: Project = {
          label: newProjectLabel,
          layers: [],
        };

        createProject(newProject);
        toggleCreatingNewProject();
      }
    },
    [createProject, newProjectLabel, toggleCreatingNewProject],
  );

  return (
    <Layout onSubmit={onCreateNewProject}>
      {creatingNewProject ? (
        <>
          <input
            type="text"
            value={newProjectLabel}
            onChange={onNewProjectLabelChange}
            placeholder="New Project Label"
          />
          <Controls>
            <ControlButton type="button" onClick={toggleCreatingNewProject}>
              Cancel
            </ControlButton>
            <ControlButton type="submit">Create</ControlButton>
          </Controls>
        </>
      ) : (
        <ControlButton onClick={toggleCreatingNewProject}>
          New Project
        </ControlButton>
      )}
    </Layout>
  );
};
