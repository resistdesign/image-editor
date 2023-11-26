export type ImageInfo = {
  name: string;
  type: string;
  data: Blob;
};

export const loadImage = async (): Promise<ImageInfo> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*"; // Accept only image types

    input.onchange = () => {
      const file = input.files ? input.files[0] : null;
      if (!file) {
        reject(new Error("No file selected."));
        return;
      }

      if (!file.type.match("image.*")) {
        reject(new Error("Selected file is not an image."));
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const arrayBuffer = ev.target?.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          const blob = new Blob([arrayBuffer], { type: file.type });
          resolve({
            name: file.name,
            type: file.type,
            data: blob,
          });
        } else {
          reject(new Error("File read did not result in an ArrayBuffer."));
        }
      };
      reader.onerror = () => {
        reject(new Error(`Error reading file: ${reader.error?.message}`));
      };

      // Read the file as an ArrayBuffer
      reader.readAsArrayBuffer(file);
    };

    input.click();
  });
};
