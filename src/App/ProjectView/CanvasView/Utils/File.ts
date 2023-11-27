export type Dimensions = {
  width: number;
  height: number;
};

export type ImageInfo = {
  name: string;
  type: string;
  data: Blob;
  dimensions: Dimensions;
};

export const getImageDimensions = async (
  imageData: Blob,
): Promise<Dimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageData);

    img.onload = () => {
      const { width, height } = img;
      URL.revokeObjectURL(url);
      resolve({
        width,
        height,
      });
    };

    img.onerror = () => {
      reject(new Error("Error loading image"));
    };

    img.src = url;
  });
};

export const blobToBase64 = async (blob: Blob): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
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
      reader.onload = async (ev) => {
        const arrayBuffer = ev.target?.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          const blob = new Blob([arrayBuffer], { type: file.type });
          const dimensions = await getImageDimensions(blob);

          resolve({
            name: file.name,
            type: file.type,
            data: blob,
            dimensions,
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
