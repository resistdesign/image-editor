import { FC, useCallback, useMemo, useState } from "react";
import styled from "styled-components";

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
  gap: 1em;
`;
const ControlButton = styled.button`
  flex: 1 0 auto;
`;

export type DeleteProjectViewProps = {
  selectedIdMap?: Record<string, boolean>;
  deleteProject?: (id: string) => void;
};

export const DeleteProjectView: FC<DeleteProjectViewProps> = ({
  selectedIdMap = {},
  deleteProject,
}) => {
  const selectedIds = useMemo<string[]>(() => {
    return Object.keys(selectedIdMap || {}).filter((id) => {
      return selectedIdMap[id];
    });
  }, [selectedIdMap]);
  const [deleting, setDeleting] = useState(false);
  const onStartedDeleting = useCallback(() => {
    setDeleting(true);
  }, []);
  const onStopDeleting = useCallback(() => {
    setDeleting(false);
  }, []);
  const showControls = selectedIds.length > 0;
  const onDeleteSelected = useCallback(() => {
    selectedIds.forEach((id) => {
      deleteProject?.(id);
    });

    onStopDeleting();
  }, [selectedIds, deleteProject, onStopDeleting]);

  return (
    <Layout>
      {showControls ? (
        deleting ? (
          <>
            <ControlButton type="button" onClick={onStopDeleting}>
              Cancel
            </ControlButton>
            <ControlButton type="button" onClick={onDeleteSelected}>
              Confirm
            </ControlButton>
          </>
        ) : (
          <ControlButton type="button" onClick={onStartedDeleting}>
            Delete
          </ControlButton>
        )
      ) : undefined}
    </Layout>
  );
};
