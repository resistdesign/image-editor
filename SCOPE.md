# Scope

## UI

- Project View: The view of all projects and the current canvas.
    - Project List: The list of all projects.
    - Canvas View: The current canvas.
        - Tool View: A selection of available tools.
            - Move
            - Resize
            - Crop
            - Mystery Tool (?) 😮
        - Canvas: The actual canvas that represents the current image.
            - Layers: Multiple layers.
                - Layer: A matrix of pixel information including opacity.

## State

- Projects: A list of all projects.
- Open Project: The currently open project being edited.
    - Modifications: A collection of patches applied to the open project since it was opened.
